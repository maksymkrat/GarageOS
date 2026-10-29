import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import type { UploadFile } from '@/api/client';

const MAX_SIDE = 1024;
const QUALITY = 0.7;

export type PhotoSource = 'camera' | 'library';

export class PhotoAccessError extends Error {}

const SELECTION_LIMIT = 10;

export async function pickVehiclePhoto(source: PhotoSource): Promise<UploadFile | null> {
  await requirePermission(source);

  // 1:1 is the one ratio that behaves the same on both platforms: the iOS crop
  // frame is always square, and `aspect` applies on Android only.
  const result = await launch(source, {
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) return null;

  return compress(result.assets[0]);
}

// Several at once, and therefore **without** the crop step: `allowsEditing` is
// mutually exclusive with `allowsMultipleSelection` in expo-image-picker, so
// cropping each one by hand and picking a batch cannot both happen. The square
// is not lost — the server crops from the centre regardless, which is exactly
// why that invariant lives there and not in the picker (ADR-0027).
export async function pickVehiclePhotos(source: PhotoSource): Promise<UploadFile[]> {
  await requirePermission(source);

  const result = await launch(source, {
    mediaTypes: 'images',
    allowsMultipleSelection: source === 'library',
    selectionLimit: SELECTION_LIMIT,
    quality: 1,
  });

  if (result.canceled) return [];

  // Sequential rather than Promise.all: each pass decodes a full-size photo,
  // and doing ten of those at once is how a phone runs out of memory.
  const files: UploadFile[] = [];

  for (const asset of result.assets) {
    files.push(await compress(asset));
  }

  return files;
}

async function requirePermission(source: PhotoSource): Promise<void> {
  if (source !== 'camera') return;

  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new PhotoAccessError('Немає доступу до камери. Дозвольте його в налаштуваннях.');
  }
}

function launch(
  source: PhotoSource,
  options: ImagePicker.ImagePickerOptions
): Promise<ImagePicker.ImagePickerResult> {
  return source === 'camera'
    ? ImagePicker.launchCameraAsync(options)
    : ImagePicker.launchImageLibraryAsync(options);
}

async function compress(asset: ImagePicker.ImagePickerAsset): Promise<UploadFile> {
  const context = ImageManipulator.manipulate(asset.uri);

  // By the longer side and only downwards. Setting width and height together
  // would stretch anything the crop left non-square, and width or height can
  // come back as 0, in which case nothing is resized and the server shrinks it.
  const longer = Math.max(asset.width, asset.height);

  if (longer > MAX_SIDE) {
    context.resize(
      asset.width >= asset.height
        ? { width: MAX_SIDE, height: null }
        : { width: null, height: MAX_SIDE }
    );
  }

  const rendered = await context.renderAsync();

  const file = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: QUALITY,
  });

  return { uri: file.uri };
}
