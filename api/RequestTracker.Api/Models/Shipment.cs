namespace RequestTracker.Api.Models;

public enum ShipmentStatus
{
    Draft,
    InTransit,
    Delivered,
    Delayed,
    Cancelled
}

public sealed record Shipment
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string ReferenceNumber { get; init; } = string.Empty;
    public string Origin { get; init; } = string.Empty;
    public string Destination { get; init; } = string.Empty;
    public ShipmentStatus Status { get; init; } = ShipmentStatus.Draft;
    public DateTimeOffset LastUpdated { get; init; } = DateTimeOffset.UtcNow;
    public string? CurrentLocation { get; init; }
}
