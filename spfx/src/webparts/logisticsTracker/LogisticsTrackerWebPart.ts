import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import { AadHttpClient, AadTokenProviderFactory } from '@microsoft/sp-http';

import LogisticsTracker from './components/LogisticsTracker';
import { ILogisticsTrackerProps } from './components/ILogisticsTrackerProps';

export interface ILogisticsTrackerWebPartProps {
  apiBaseUrl: string;
  aadAppId: string;
}

export default class LogisticsTrackerWebPart extends BaseClientSideWebPart<ILogisticsTrackerWebPartProps> {
  private _client: AadHttpClient | undefined;

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (!this.properties.aadAppId) {
      throw new Error('The Azure AD application ID URI must be configured before using the web part.');
    }
    if (!this.properties.apiBaseUrl) {
      throw new Error('The API base URL must be configured before using the web part.');
    }

    const tokenFactory = this.context.aadTokenProviderFactory as AadTokenProviderFactory;
    const provider = await tokenFactory.getTokenProvider();
    this._client = await this.context.aadHttpClientFactory.getClient(this.properties.aadAppId);

    // Pre-fetch to ensure login prompt occurs eagerly
    await provider.getToken(this.properties.aadAppId).catch(() => undefined);
  }

  public render(): void {
    if (!this._client) {
      ReactDom.render(React.createElement('div', {}, 'Loading authentication context...'), this.domElement);
      return;
    }

    const element: React.ReactElement<ILogisticsTrackerProps> = React.createElement(LogisticsTracker, {
      httpClient: this._client,
      apiBaseUrl: this.properties.apiBaseUrl
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Logistics Request Tracker settings' },
          groups: [
            {
              groupName: 'Configuration',
              groupFields: [
                PropertyPaneTextField('apiBaseUrl', {
                  label: 'API base URL',
                  description: 'Base URL of the Request Tracker API (e.g. https://contoso.azurewebsites.net)',
                  placeholder: 'https://...'
                }),
                PropertyPaneTextField('aadAppId', {
                  label: 'Azure AD application ID URI',
                  description: 'The application ID URI of the secured API (e.g. api://<guid>)',
                  placeholder: 'api://...'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
