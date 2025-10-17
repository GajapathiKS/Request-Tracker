using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RequestTracker.Api.Contracts;
using RequestTracker.Api.Models;
using RequestTracker.Api.Services;

namespace RequestTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ShipmentsController : ControllerBase
{
    private readonly IShipmentRepository _repository;

    public ShipmentsController(IShipmentRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Shipment>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var shipments = await _repository.GetAsync(cancellationToken);
        return Ok(shipments);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<Shipment>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var shipment = await _repository.GetAsync(id, cancellationToken);
        if (shipment is null)
        {
            return NotFound();
        }

        return Ok(shipment);
    }

    [HttpPost]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<Shipment>> CreateAsync([FromBody] CreateShipmentRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var shipment = new Shipment
        {
            ReferenceNumber = request.ReferenceNumber,
            Origin = request.Origin,
            Destination = request.Destination,
            Status = request.Status,
            CurrentLocation = request.CurrentLocation
        };

        var result = await _repository.CreateAsync(shipment, cancellationToken);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = result.Id }, result);
    }

    [HttpPatch("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<Shipment>> UpdateAsync(Guid id, [FromBody] UpdateShipmentRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var shipment = await _repository.UpdateAsync(id, request.Status, request.CurrentLocation, cancellationToken);
        if (shipment is null)
        {
            return NotFound();
        }

        return Ok(shipment);
    }
}
