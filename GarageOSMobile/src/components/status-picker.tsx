import { PickerDialog } from '@/components/ui/picker-dialog';
import { useUpdateClientVehicleStatus } from '@/queries/use-client-vehicles';
import { STATUS_META } from '@/theme/status';
import type { ClientVehicleStatus } from '@/types/domain';

// Board order, not alphabetical: this is the path a car walks through.
const STATUS_ORDER: ClientVehicleStatus[] = ['in_work', 'waiting_part', 'ready', 'has_debt'];

interface StatusPickerProps {
  vehicleId: number;
  status: ClientVehicleStatus;
  visible: boolean;
  onClose: () => void;
}

export function StatusPicker({ vehicleId, status, visible, onClose }: StatusPickerProps) {
  const update = useUpdateClientVehicleStatus(vehicleId);

  return (
    <PickerDialog
      visible={visible}
      title="Стан авто"
      options={STATUS_ORDER.map((value) => ({
        value,
        label: STATUS_META[value].label,
        dot: STATUS_META[value].dot,
      }))}
      value={status}
      busy={update.isPending}
      error={
        update.error instanceof Error ? update.error.message : update.error ? 'Не вдалося' : undefined
      }
      onPick={(next) => {
        if (next === status) {
          onClose();
          return;
        }

        update.mutate({ status: next }, { onSuccess: onClose });
      }}
      onCancel={onClose}
    />
  );
}
