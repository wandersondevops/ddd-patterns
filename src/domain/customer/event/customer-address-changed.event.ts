import EventInterface from "../../@shared/event/event.interface";
import Address from "../value-object/address";

export interface CustomerAddressChangedEventData {
  id: string;
  name: string;
  address: Address;
}

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: CustomerAddressChangedEventData;

  constructor(eventData: CustomerAddressChangedEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
