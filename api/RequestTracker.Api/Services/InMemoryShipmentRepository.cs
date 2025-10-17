using RequestTracker.Api.Models;

namespace RequestTracker.Api.Services;

public sealed class InMemoryShipmentRepository : IShipmentRepository
{
    private readonly Dictionary<Guid, Shipment> _store = new();
    private readonly SemaphoreSlim _lock = new(1, 1);

    public InMemoryShipmentRepository()
    {
        var seed = new[]
        {
            new Shipment
            {
                ReferenceNumber = "ATL-001",
                Origin = "Atlanta, USA",
                Destination = "Hamburg, Germany",
                Status = ShipmentStatus.InTransit,
                CurrentLocation = "Atlantic Ocean"
            },
            new Shipment
            {
                ReferenceNumber = "SIN-204",
                Origin = "Singapore",
                Destination = "Sydney, Australia",
                Status = ShipmentStatus.Delayed,
                CurrentLocation = "Darwin, Australia"
            }
        };

        foreach (var shipment in seed)
        {
            _store.Add(shipment.Id, shipment);
        }
    }

    public async Task<IEnumerable<Shipment>> GetAsync(CancellationToken cancellationToken = default)
    {
        await _lock.WaitAsync(cancellationToken);
        try
        {
            return _store.Values
                .OrderByDescending(s => s.LastUpdated)
                .ToArray();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Shipment?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _lock.WaitAsync(cancellationToken);
        try
        {
            return _store.TryGetValue(id, out var shipment) ? shipment : null;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Shipment> CreateAsync(Shipment shipment, CancellationToken cancellationToken = default)
    {
        await _lock.WaitAsync(cancellationToken);
        try
        {
            var newShipment = shipment with { LastUpdated = DateTimeOffset.UtcNow };
            _store.Add(newShipment.Id, newShipment);
            return newShipment;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Shipment?> UpdateAsync(Guid id, ShipmentStatus status, string? currentLocation, CancellationToken cancellationToken = default)
    {
        await _lock.WaitAsync(cancellationToken);
        try
        {
            if (!_store.TryGetValue(id, out var shipment))
            {
                return null;
            }

            var updated = shipment with
            {
                Status = status,
                CurrentLocation = currentLocation,
                LastUpdated = DateTimeOffset.UtcNow
            };

            _store[id] = updated;
            return updated;
        }
        finally
        {
            _lock.Release();
        }
    }
}
