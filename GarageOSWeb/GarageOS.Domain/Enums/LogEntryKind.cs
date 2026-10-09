namespace GarageOS.Domain.Enums;

/// <summary>Тип запису в журналі ТО. Контракт: 'oil' | 'brakes' | 'tires' | 'filter' | 'other'.</summary>
public enum LogEntryKind
{
    Oil = 0,
    Brakes = 1,
    Tires = 2,
    Filter = 3,
    Other = 4
}
