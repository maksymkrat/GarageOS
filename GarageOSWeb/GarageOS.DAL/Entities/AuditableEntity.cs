namespace GarageOS.DAL.Entities;

/// <summary>Спільна основа всіх таблиць: сурогатний ключ і поля аудиту з ER-схеми.</summary>
public abstract class AuditableEntity
{
    public int Id { get; set; }

    /// <summary>Проставляє <c>GarageDbContext.SaveChanges</c>, не прикладний код.</summary>
    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
