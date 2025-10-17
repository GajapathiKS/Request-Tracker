using RequestTracker.Api.Models;

namespace RequestTracker.Api.Services;

public interface IShipmentRepository
{
    Task<IEnumerable<Shipment>> GetAsync(CancellationToken cancellationToken = default);
    Task<Shipment?> GetAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Shipment> CreateAsync(Shipment shipment, CancellationToken cancellationToken = default);
    Task<Shipment?> UpdateAsync(Guid id, ShipmentStatus status, string? currentLocation, CancellationToken cancellationToken = default);
}
