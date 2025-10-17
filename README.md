# Logistics Request Tracker

This repository contains a reference implementation of a logistics shipment tracking platform composed of:

- **RequestTracker.Api** – a .NET 8 Web API secured with Azure Active Directory (Entra ID) and role-based authorization.
- **Logistics Request Tracker SPFx web part** – a SharePoint Framework (SPFx) React client that consumes the API and surfaces shipment data inside SharePoint or Microsoft Teams.

The solution demonstrates how admins can onboard new shipments while standard authenticated users can view existing shipments.

## Architecture

```text
Request-Tracker/
├── api/
│   └── RequestTracker.Api/        # ASP.NET Core Web API project
└── spfx/
    └── ...                        # SPFx React web part
```

### API Highlights

- Azure AD authentication using `Microsoft.Identity.Web`.
- Role-based policies restricting shipment creation and updates to users in the `Admin` or `HubOwner` roles.
- Seeded in-memory repository for demo purposes.
- OpenAPI/Swagger enabled for local development.

### SPFx Web Part Highlights

- Uses the SharePoint `AadHttpClient` to call the secured API.
- React UI that lists shipments for all authenticated users.
- Conditional rendering of admin-only controls for users in the `Admin` or `HubOwner` roles.
- Form validation and optimistic updates when onboarding new shipments.

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18 LTS](https://nodejs.org/) with npm
- Yeoman SharePoint Generator prerequisites for SPFx 1.18
- Access to an Azure AD tenant where you can register applications

### Configure Azure AD

1. Register a new **App registration** for the API and expose an application ID URI (e.g. `api://<client-id>`).
2. Assign delegated permissions for the SPFx client to access the API (custom scope or default `user_impersonation`).
3. Create app roles named `Admin` and `HubOwner` on the API app registration and assign them to appropriate users or groups.
4. Update `api/RequestTracker.Api/appsettings.json` with your Azure AD tenant, client ID, and audience values.
5. Update the SPFx web part manifest (`spfx/src/webparts/logisticsTracker/LogisticsTrackerWebPart.manifest.json`) so that `apiBaseUrl` points to your API hosting location and `aadAppId` matches the API's application ID URI.

### Run the API

```bash
cd api/RequestTracker.Api
dotnet restore
dotnet run
```

The API listens on `https://localhost:7283` by default. Use Swagger UI at `/swagger` for exploring endpoints.

### Run the SPFx Web Part

```bash
cd spfx
npm install
npm run serve
```

Open the local workbench URL printed in the console (by default `https://localhost:4321/temp/workbench.html`) and add the **Logistics Request Tracker** web part.

> **Note:** When hosted in SharePoint Online, ensure the SPFx solution is granted API permissions for the Azure AD app used by the API.

## API Endpoints

| Method | Endpoint | Description | Authorization |
| --- | --- | --- | --- |
| `GET` | `/api/me` | Returns the signed-in user's name and roles. | Any authenticated user |
| `GET` | `/api/shipments` | Lists all shipments. | Any authenticated user |
| `GET` | `/api/shipments/{id}` | Retrieves a single shipment by ID. | Any authenticated user |
| `POST` | `/api/shipments` | Creates a new shipment. | `Admin` or `HubOwner` role |
| `PATCH` | `/api/shipments/{id}` | Updates an existing shipment's status/location. | `Admin` or `HubOwner` role |

## Extensibility

- Replace the in-memory repository with a persistent storage provider (SQL, Cosmos DB, etc.).
- Integrate telemetry or auditing around shipment updates.
- Extend the SPFx web part to show shipment timelines or integrate with Microsoft Teams adaptive cards.

## License

This project is provided as-is for demonstration purposes.
