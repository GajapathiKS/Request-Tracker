export interface Shipment {
  id: string;
  referenceNumber: string;
  origin: string;
  destination: string;
  status: string;
  currentLocation?: string;
  lastUpdated: string;
}

export interface CreateShipmentRequest {
  referenceNumber: string;
  origin: string;
  destination: string;
  status: string;
  currentLocation?: string;
}

export interface UpdateShipmentRequest {
  status: string;
  currentLocation?: string;
}
