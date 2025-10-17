using System.ComponentModel.DataAnnotations;
using RequestTracker.Api.Models;

namespace RequestTracker.Api.Contracts;

public sealed class CreateShipmentRequest
{
    [Required]
    [StringLength(50)]
    public string ReferenceNumber { get; set; } = string.Empty;

    [Required]
    public string Origin { get; set; } = string.Empty;

    [Required]
    public string Destination { get; set; } = string.Empty;

    public ShipmentStatus Status { get; set; } = ShipmentStatus.InTransit;

    public string? CurrentLocation { get; set; }
}
