# Logistics Request Tracker SPFx Web Part

This project contains the SharePoint Framework (SPFx) React client for the Logistics Request Tracker solution.

## Development Workflow

1. Update the API base URL (`apiBaseUrl`) and Azure AD application ID URI (`aadAppId`) properties in `src/webparts/logisticsTracker/LogisticsTrackerWebPart.manifest.json` to match your environment.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local workbench:

   ```bash
   npm run serve
   ```

4. When prompted, authenticate with Azure AD to acquire a token for the API.

## Packaging

```bash
npm run bundle
npm run package
```

The generated `.sppkg` package will be located under `sharepoint/solution` once built.
