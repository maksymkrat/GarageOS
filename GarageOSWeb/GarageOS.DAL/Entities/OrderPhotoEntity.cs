namespace GarageOS.DAL.Entities;

public class OrderPhotoEntity : BaseEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    // Two ids with two jobs. `Id` is what the contract addresses and what sorts
    // the gallery; `PhotoId` names the file on disk, so file names never depend
    // on a database sequence and IPhotoStorage keeps one signature for every
    // kind of owner (ADR-0027).
    public Guid PhotoId { get; set; }
}
