import { AadHttpClient } from '@microsoft/sp-http';
export interface ILogisticsTrackerProps {
  httpClient: AadHttpClient;
  apiBaseUrl: string;
}
