import { Image } from 'expo-image';

import type { PhotoSource } from '@/components/ui/vehicle-image';

export function warmPhotoCache(...sources: PhotoSource[]): void {
  for (const source of sources) {
    void Image.prefetch(source.uri, {
      headers: source.headers,
      cachePolicy: 'memory-disk',
    }).catch(() => undefined);
  }
}
