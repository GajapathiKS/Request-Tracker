import * as React from 'react';
import { Spinner, SpinnerSize, MessageBar, MessageBarType, PrimaryButton, Stack, TextField, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { AadHttpClient } from '@microsoft/sp-http';
import { ILogisticsTrackerProps } from './ILogisticsTrackerProps';
import ShipmentService from '../../../services/ShipmentService';
import { Shipment, CreateShipmentRequest } from '../../../models/Shipment';
import { RoleContext } from '../../../common/RoleContext';
import ShipmentList from './ShipmentList';

const statusOptions: IDropdownOption[] = [
  { key: 'Draft', text: 'Draft' },
  { key: 'InTransit', text: 'In transit' },
  { key: 'Delivered', text: 'Delivered' },
  { key: 'Delayed', text: 'Delayed' },
  { key: 'Cancelled', text: 'Cancelled' }
];

const LogisticsTracker: React.FunctionComponent<ILogisticsTrackerProps> = (props) => {
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [newShipment, setNewShipment] = React.useState<CreateShipmentRequest>({
    referenceNumber: '',
    origin: '',
    destination: '',
    status: 'InTransit'
  });

  const serviceRef = React.useRef<ShipmentService>();

  React.useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = new ShipmentService(props.httpClient, props.apiBaseUrl);
    }

    const fetchContext = async (): Promise<void> => {
      try {
        const response = await props.httpClient.get(`${props.apiBaseUrl}/api/me`, AadHttpClient.configurations.v1);
        if (response.ok) {
          const user = await response.json();
          const roles: string[] = user.roles || user.Roles || [];
          setIsAdmin(roles.some((role) => role === 'Admin' || role === 'HubOwner'));
        }
      } catch (err) {
        console.warn('Failed to resolve user context', err);
      }
    };

    const loadShipments = async (): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const items = await serviceRef.current!.listAsync();
        setShipments(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchContext().finally(loadShipments);
  }, [props.apiBaseUrl, props.httpClient]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!serviceRef.current) {
      return;
    }

    setError(undefined);
    try {
      const created = await serviceRef.current.createAsync(newShipment);
      setShipments((prev) => [created, ...prev]);
      setNewShipment({ referenceNumber: '', origin: '', destination: '', status: 'InTransit' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipment.');
    }
  };

  return (
    <RoleContext.Provider value={{ isAdmin }}>
      <Stack tokens={{ childrenGap: 16 }}>
        {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
        {loading ? (
          <Spinner label="Loading shipments" size={SpinnerSize.large} />
        ) : (
          <ShipmentList shipments={shipments} />
        )}

        {isAdmin && (
          <form onSubmit={onSubmit}>
            <Stack tokens={{ childrenGap: 8 }}>
              <h3>Add a new shipment</h3>
              <TextField
                label="Reference number"
                required
                value={newShipment.referenceNumber}
                onChange={(_, value) => setNewShipment((prev) => ({ ...prev, referenceNumber: value || '' }))}
              />
              <TextField
                label="Origin"
                required
                value={newShipment.origin}
                onChange={(_, value) => setNewShipment((prev) => ({ ...prev, origin: value || '' }))}
              />
              <TextField
                label="Destination"
                required
                value={newShipment.destination}
                onChange={(_, value) => setNewShipment((prev) => ({ ...prev, destination: value || '' }))}
              />
              <Dropdown
                label="Status"
                options={statusOptions}
                selectedKey={newShipment.status}
                onChange={(_, option) => option && setNewShipment((prev) => ({ ...prev, status: option.key as string }))}
              />
              <TextField
                label="Current location"
                value={newShipment.currentLocation}
                onChange={(_, value) => setNewShipment((prev) => ({ ...prev, currentLocation: value || undefined }))}
              />
              <PrimaryButton type="submit" text="Create shipment" />
            </Stack>
          </form>
        )}
      </Stack>
    </RoleContext.Provider>
  );
};

export default LogisticsTracker;
