import { Image, type ImageErrorEventData } from 'expo-image';
import { useIsFocused } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { CarGlyph } from '@/components/icons';
import { colors } from '@/theme/tokens';

// What `authorizedSource()` hands back: the photo endpoints sit behind a token,
// so a URL on its own is not enough to fetch them.
export interface PhotoSource {
  uri: string;
  headers?: Record<string, string>;
}

interface VehicleImageProps {
  // Null when the vehicle has no photo yet — every list and card then shows the
  // same grey car instead of an empty hole.
  source: PhotoSource | null;
  // Size and corner radius belong to the caller; the frame's colours do not.
  style?: StyleProp<ViewStyle>;
  glyph?: number;
}

// A grey square with a car in it, and the photo laid over that square. The
// square is an ordinary child and carries the size; the photo is absolute and
// has nothing to work out for itself. That is the shape of the two places
// that repaint a replaced picture on the spot — the customer card's header
// and the slot on a vehicle of our own — and the shape this had before, where
// the image was a child of the frame and took its size from it, is the one
// that kept showing nothing until the screen was built again.
export function VehicleImage({ source, style, glyph = 48 }: VehicleImageProps) {
  // The URL that failed, not a flag: the same slot shows the next photo after
  // a replacement, so the failure has to fall away with the picture it belongs
  // to instead of hiding the one that took its place.
  const [failed, setFailed] = useState<string | null>(null);

  // Part of the image's identity below. A screen that is not on top is
  // detached by react-native-screens and stops being laid out, while
  // expo-image starts a load when its view is given a size — a photo replaced
  // while this list sits behind the car's own screen would otherwise reach a
  // view that never asks for it. Coming back into focus builds it again.
  const focused = useIsFocused();

  const broken = source !== null && failed === source.uri;

  function onError(uri: string, { error }: ImageErrorEventData) {
    // Dev only: a yellow box over the master's screen is worse than the slot it
    // reports. Without it a picture that never arrives leaves nothing behind to
    // explain itself — and the car glyph below looks like a car with no photo.
    if (__DEV__) console.warn(`[photo] ${uri} не завантажилось: ${error}`);

    setFailed(uri);
  }

  return (
    <View style={style}>
      <View style={[styles.box, (source === null || broken) && styles.empty, style]}>
        <CarGlyph size={glyph} color={colors.placeholder} />
      </View>

      {source !== null && !broken && (
        <Image
          key={`${source.uri}#${focused}`}
          source={source}
          contentFit="cover"
          // The caller's style once more: it is what gives the picture the
          // same size and corner radius as the square underneath it. The cast
          // is only about `overflow: 'scroll'`, which an image style does not
          // have and no caller passes — everything here is geometry.
          style={[styles.over, style as StyleProp<ImageStyle>]}
          // The prefetch after an upload writes to both caches; reading from
          // only one of them would make that warm-up a download all over again.
          cachePolicy="memory-disk"
          onError={(event) => onError(source.uri, event)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  over: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
