import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import type { UploadFile } from '@/api/client';
import type { PickerOption } from '@/components/ui/picker-dialog';
import { pickVehiclePhoto, pickVehiclePhotos } from '@/lib/photo';

export type PhotoAction = 'camera' | 'library' | 'remove';

interface PhotoActionsOptions {
  // A gallery takes a batch; a card that holds one photo does not. Picking
  // several means no per-photo crop, because expo-image-picker cannot do both —
  // the server's centre crop covers it (ADR-0027).
  multiple?: boolean;
}

interface PhotoActions {
  open: boolean;
  busy: boolean;
  options: PickerOption<PhotoAction>[];
  start: () => void;
  close: () => void;
  run: (action: PhotoAction) => Promise<void>;
}

function reason(cause: unknown): string {
  return cause instanceof Error ? cause.message : 'не вдалося';
}

// One flow behind four different triggers: the header button on a customer's
// car, the slot on a personal vehicle, the photo block on a naryad and the same
// block in the create form. Only the two writes differ, so they come in as
// plain promises — `mutateAsync` from either mutation fits, and the labels stay
// in one place.
export function usePhotoActions(
  save: (file: UploadFile) => Promise<unknown>,
  remove: (() => Promise<unknown>) | null,
  { multiple = false }: PhotoActionsOptions = {}
): PhotoActions {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const run = useCallback(
    async (action: PhotoAction) => {
      // Shut before launching anything. The system camera and gallery are
      // native screens, and presenting one on top of an open React Native
      // Modal is a known way to have it refuse to appear — our own dialog has
      // to be out of the way first. Progress shows on the trigger instead,
      // which is why `busy` outlives this call.
      setOpen(false);
      setBusy(true);

      try {
        if (action === 'remove') {
          if (remove !== null) await remove();
          return;
        }

        const picked = multiple
          ? await pickVehiclePhotos(action)
          : [await pickVehiclePhoto(action)].filter((file) => file !== null);

        // Cancelled in the system picker — not an error, just nothing to do.
        if (picked.length === 0) return;

        // One at a time so a gallery keeps the order they were picked in, and
        // so one bad upload does not take the rest of the batch with it.
        const failures: string[] = [];

        for (const file of picked) {
          try {
            await save(file);
          } catch (cause) {
            failures.push(reason(cause));
          }
        }

        if (failures.length === 0) return;

        // Alert rather than text in the dialog: the dialog is already closed by
        // now, and a native alert does not care what is mounted.
        Alert.alert(
          'Фото',
          picked.length === 1
            ? `Не вдалося завантажити фото: ${failures[0]}`
            : `${failures.length} з ${picked.length} фото не завантажились: ${failures[0]}`
        );
      } catch (cause) {
        Alert.alert('Фото', reason(cause));
      } finally {
        setBusy(false);
      }
    },
    [save, remove, multiple]
  );

  const options = useMemo<PickerOption<PhotoAction>[]>(
    () => [
      { value: 'camera', label: 'Камера' },
      { value: 'library', label: multiple ? 'Галерея — можна кілька' : 'Галерея' },
      ...(remove === null ? [] : [{ value: 'remove' as PhotoAction, label: 'Видалити фото' }]),
    ],
    [remove, multiple]
  );

  return { open, busy, options, start: () => setOpen(true), close, run };
}
