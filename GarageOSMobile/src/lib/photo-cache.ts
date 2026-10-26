import { Image } from 'expo-image';

import type { PhotoSource } from '@/components/ui/vehicle-image';

// Pulls a freshly uploaded photo into the image cache before anything asks for
// it. Without this the screen you return to has the right `photoId` but none of
// the bytes, so the slot sits grey while the thumbnail downloads — the upload
// already waited for the server, and this costs nothing on top of it.
//
// Fire and forget on purpose: a failed warm-up is invisible, because the real
// fetch happens when the image renders anyway.
export function warmPhotoCache(...sources: PhotoSource[]): void {
  for (const source of sources) {
    void Image.prefetch(source.uri, {
      headers: source.headers,
      cachePolicy: 'memory-disk',
    }).catch(() => undefined);
  }
}
