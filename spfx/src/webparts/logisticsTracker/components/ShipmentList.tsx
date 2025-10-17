import * as React from 'react';
import { DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react';
import { Shipment } from '../../../models/Shipment';

export interface IShipmentListProps {
  shipments: Shipment[];
}

const columns: IColumn[] = [
  { key: 'reference', name: 'Reference', fieldName: 'referenceNumber', minWidth: 120, maxWidth: 150, isResizable: true },
  { key: 'origin', name: 'Origin', fieldName: 'origin', minWidth: 140, isResizable: true },
  { key: 'destination', name: 'Destination', fieldName: 'destination', minWidth: 140, isResizable: true },
  { key: 'status', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 120 },
  { key: 'location', name: 'Current location', fieldName: 'currentLocation', minWidth: 160, isResizable: true },
  { key: 'updated', name: 'Last updated', fieldName: 'lastUpdated', minWidth: 160, isResizable: true }
];

const ShipmentList: React.FunctionComponent<IShipmentListProps> = ({ shipments }) => {
  const items = React.useMemo(
    () =>
      shipments.map((shipment) => ({
        ...shipment,
        lastUpdated: new Date(shipment.lastUpdated).toLocaleString()
      })),
    [shipments]
  );

  return <DetailsList items={items} columns={columns} selectionMode={SelectionMode.none} />;
};

export default ShipmentList;
