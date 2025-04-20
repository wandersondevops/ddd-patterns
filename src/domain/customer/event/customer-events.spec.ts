import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";
import EnviaConsoleLogHandler from "./handler/envia-console-log-address-changed.handler";

describe("Customer domain events tests", () => {
  it("should register event handlers for CustomerCreatedEvent", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);
  });

  it("should register event handler for CustomerAddressChangedEvent", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length
    ).toBe(1);
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should notify all handlers when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "123",
      name: "Customer 1",
    });

    // When the customer is created, the notification is triggered
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify handler when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "123",
      name: "Customer 1",
      address: address,
    });

    // When the customer address is changed, the notification is triggered
    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should log messages when customer is created", () => {
    // Spy on console.log
    const spyConsole = jest.spyOn(console, "log");

    // Create event handlers
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    // Create event
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "123",
      name: "Customer 1",
    });

    // Handle events
    eventHandler1.handle(customerCreatedEvent);
    eventHandler2.handle(customerCreatedEvent);

    // Check if console.log was called with the correct messages
    expect(spyConsole).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
    expect(spyConsole).toHaveBeenCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
  });

  it("should log message when customer address is changed", () => {
    // Spy on console.log
    const spyConsole = jest.spyOn(console, "log");

    // Create event handler
    const eventHandler = new EnviaConsoleLogHandler();

    // Create address and event
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "123",
      name: "Customer 1",
      address: address,
    });

    // Handle event
    eventHandler.handle(customerAddressChangedEvent);

    // Check if console.log was called with the correct message
    expect(spyConsole).toHaveBeenCalledWith(
      `Endereço do cliente: 123, Customer 1 alterado para: ${address.toString()}`
    );
  });

  it("should trigger events when customer is created and address is changed", () => {
    // Set up event dispatcher and handlers
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const addressChangedHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerAddressChangedEvent", addressChangedHandler);

    // Spy on console.log
    const spyConsole = jest.spyOn(console, "log");

    // Create a customer (this will trigger the CustomerCreatedEvent)
    const customer = new Customer("123", "Customer 1");
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
    });
    eventDispatcher.notify(customerCreatedEvent);
    
    // Change the customer address (this will trigger the CustomerAddressChangedEvent)
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(address);
    const addressChangedEvent = new CustomerAddressChangedEvent({
      id: customer.id,
      name: customer.name,
      address: address,
    });
    eventDispatcher.notify(addressChangedEvent);

    // Check if events were triggered
    expect(spyConsole).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
    expect(spyConsole).toHaveBeenCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
    expect(spyConsole).toHaveBeenCalledWith(
      `Endereço do cliente: 123, Customer 1 alterado para: ${address.toString()}`
    );
  });
});
