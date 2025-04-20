import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await (OrderModel as any).create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item: OrderItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    // First, update the order
    await (OrderModel as any).update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );

    // Delete existing order items
    await (OrderItemModel as any).destroy({
      where: { order_id: entity.id },
    });

    // Create new order items
    const items = entity.items.map((item: OrderItem) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
      order_id: entity.id,
    }));

    await (OrderItemModel as any).bulkCreate(items);
  }

  async find(id: string): Promise<Order> {
    const orderModel = await (OrderModel as any).findOne({
      where: { id },
      include: ["items"],
    });

    if (!orderModel) {
      throw new Error(`Order with id ${id} not found`);
    }

    const orderItems = orderModel.items.map((item: any) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );
    });

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await (OrderModel as any).findAll({
      include: ["items"],
    });

    return orderModels.map((orderModel: any) => {
      const orderItems = orderModel.items.map((item: any) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        );
      });

      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });
  }
}
