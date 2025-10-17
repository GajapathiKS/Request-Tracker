import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { CreateShipmentRequest, Shipment, UpdateShipmentRequest } from '../models/Shipment';

export default class ShipmentService {
  public constructor(private readonly httpClient: AadHttpClient, private readonly baseUrl: string) {}

  public async listAsync(): Promise<Shipment[]> {
    const response = await this.httpClient.get(`${this.baseUrl}/api/shipments`, AadHttpClient.configurations.v1);
    await this.ensureSuccess(response);
    return response.json();
  }

  public async getAsync(id: string): Promise<Shipment> {
    const response = await this.httpClient.get(`${this.baseUrl}/api/shipments/${id}`, AadHttpClient.configurations.v1);
    await this.ensureSuccess(response);
    return response.json();
  }

  public async createAsync(request: CreateShipmentRequest): Promise<Shipment> {
    const response = await this.httpClient.post(`${this.baseUrl}/api/shipments`, AadHttpClient.configurations.v1, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    await this.ensureSuccess(response);
    return response.json();
  }

  public async updateAsync(id: string, request: UpdateShipmentRequest): Promise<Shipment> {
    const response = await this.httpClient.fetch(`${this.baseUrl}/api/shipments/${id}`, AadHttpClient.configurations.v1, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    await this.ensureSuccess(response);
    return response.json();
  }

  private async ensureSuccess(response: HttpClientResponse): Promise<void> {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed with status ${response.status}`);
    }
  }
}
