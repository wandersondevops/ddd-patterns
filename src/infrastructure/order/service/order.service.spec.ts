import { Sequelize } from "sequelize-typescript";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import Product from "../../../domain/product/entity/product";
import OrderItem from "../../../domain/checkout/entity/order_item";
import Order from "../../../domain/checkout/entity/order";
import OrderService from "../../../domain/checkout/service/order.service";
import CustomerModel from "../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../product/repository/sequelize/product.model";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import OrderModel from "../repository/sequilize/order.model";
import OrderItemModel from "../repository/sequilize/order-item.model";
import OrderRepository from "../repository/sequilize/order.repository";

// Import Jest types
import "jest";

describe("Order service integration test", () => {
  let sequelize: Sequelize;
  let customerRepository: CustomerRepository;
  let productRepository: ProductRepository;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();

    customerRepository = new CustomerRepository();
    productRepository = new ProductRepository();
    orderRepository = new OrderRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should place an order", async () => {
    // Create a customer
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    // Create products
    const product1 = new Product("p1", "Product 1", 10);
    await productRepository.create(product1);
    
    const product2 = new Product("p2", "Product 2", 20);
    await productRepository.create(product2);

    // Create order items
    const orderItem1 = new OrderItem(
      "oi1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const orderItem2 = new OrderItem(
      "oi2",
      product2.name,
      product2.price,
      product2.id,
      3
    );

    // Place order
    const order = OrderService.placeOrder(customer, [orderItem1, orderItem2]);
    
    // Save order to database
    await orderRepository.create(order);

    // Update customer in database with new reward points
    await customerRepository.update(customer);

    // Verify order was created correctly
    const foundOrder = await orderRepository.find(order.id);
    
    expect(foundOrder.id).toBe(order.id);
    expect(foundOrder.customerId).toBe(customer.id);
    expect(foundOrder.total()).toBe(80); // (10*2) + (20*3)
    expect(foundOrder.items).toHaveLength(2);
    
    // Verify customer reward points
    const updatedCustomer = await customerRepository.find(customer.id);
    expect(updatedCustomer.rewardPoints).toBe(40); // 80/2
  });

  it("should calculate the total of all orders", async () => {
    // Create a customer
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    // Create a product
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    // Create first order
    const orderItem1 = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order1 = new Order("o1", customer.id, [orderItem1]);
    await orderRepository.create(order1);

    // Create second order
    const orderItem2 = new OrderItem(
      "oi2",
      product.name,
      product.price,
      product.id,
      3
    );
    const order2 = new Order("o2", customer.id, [orderItem2]);
    await orderRepository.create(order2);

    // Get all orders
    const orders = await orderRepository.findAll();
    
    // Calculate total
    const total = OrderService.total(orders);
    
    // Verify total
    expect(total).toBe(50); // (10*2) + (10*3)
  });
});
