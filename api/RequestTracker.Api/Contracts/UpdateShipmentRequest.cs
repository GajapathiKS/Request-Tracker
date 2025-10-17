using System.ComponentModel.DataAnnotations;
using RequestTracker.Api.Models;

namespace RequestTracker.Api.Contracts;

public sealed class UpdateShipmentRequest
{
    [Required]
    public ShipmentStatus Status { get; set; }

    public string? CurrentLocation { get; set; }
}
