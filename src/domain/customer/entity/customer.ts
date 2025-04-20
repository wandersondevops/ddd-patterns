import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    
    // Notify customer created event
    const eventDispatcher = new EventDispatcher();
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: this._id,
      name: this._name,
    });
    
    // The event handlers should be registered by the application layer
    // This is just to demonstrate the event being dispatched
    eventDispatcher.notify(customerCreatedEvent);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    
    // Notify address changed event
    const eventDispatcher = new EventDispatcher();
    const addressChangedEvent = new CustomerAddressChangedEvent({
      id: this._id,
      name: this._name,
      address: this._address,
    });
    
    // The event handlers should be registered by the application layer
    // This is just to demonstrate the event being dispatched
    eventDispatcher.notify(addressChangedEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
