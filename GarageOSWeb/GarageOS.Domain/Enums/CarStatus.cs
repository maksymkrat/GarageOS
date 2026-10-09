namespace GarageOS.Domain.Enums;

/// <summary>Стан авто й наряду. Контракт клієнта: 'in_work' | 'waiting_part' | 'ready' | 'has_debt'.</summary>
public enum CarStatus
{
    InWork = 0,
    WaitingPart = 1,
    Ready = 2,
    HasDebt = 3
}
