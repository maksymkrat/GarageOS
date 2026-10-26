import { Image, type ImageErrorEventData } from 'expo-image';
import { useIsFocused } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
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

// The frame is a View, the car glyph floats behind it, and the photo is an
// ordinary child sized from the frame's measured box. `overflow: hidden` is
// what makes the caller's border radius clip the photo.
export function VehicleImage({ source, style, glyph = 48 }: VehicleImageProps) {
  // The URL that failed, not a flag: the same slot shows the next photo after
  // a replacement, so the failure has to fall away with the picture it belongs
  // to instead of hiding the one that took its place.
  const [failed, setFailed] = useState<string | null>(null);

  // The frame's measured box, and the image is sized from it in pixels. Not a
  // detail: callers build frames every which way — a fixed 72 square in a list
  // row, a full-width one whose height comes from `aspectRatio`, a flex child
  // — and a style that fills the frame has to resolve against whatever that
  // frame turned out to be. An image view that ends up without a size is one
  // expo-image clears instead of drawing (`cleanIfNeeded`), which is a grey
  // box where the photo should be. Measuring leaves nothing to resolve.
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);

  function onLayout({ nativeEvent }: LayoutChangeEvent) {
    const { width, height } = nativeEvent.layout;

    // Same box, same object: a new one on every layout pass would re-render
    // the image for nothing.
    setBox((current) =>
      current?.width === width && current?.height === height ? current : { width, height }
    );
  }

  // Part of the image's identity below, not a cosmetic detail. A screen that
  // is not on top is detached by react-native-screens: its views stop being
  // laid out, and expo-image only (re)starts a load when its view is given a
  // size (`onSizeChanged` -> `rerenderIfNeeded` in ExpoImageViewWrapper). A
  // photo replaced while the car's own screen covers the list therefore
  // reaches a view that never asks for it, and the slot stays empty until
  // something builds the view again — which is what leaving for another tab
  // and coming back does by hand. Coming back into focus does it here.
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
    <View
      onLayout={onLayout}
      style={[styles.frame, (source === null || broken) && styles.empty, style]}>
      {/* Behind the photo, and drawn even when there is one: hiding the glyph
          as soon as a source exists left a blank grey square for as long as the
          bytes took to arrive, which reads as "the photo did not load". */}
      <View style={styles.glyph}>
        <CarGlyph size={glyph} color={colors.placeholder} />
      </View>

      {source !== null && !broken && box !== null && (
        <Image
          // Keyed by the URL *and* by focus: a different picture gets a
          // different view instead of a new source handed to the one that
          // still holds the previous photo, and a view built while the screen
          // was away is built again once it is back on screen.
          key={`${source.uri}#${focused}`}
          source={source}
          contentFit="cover"
          // No `transition` either: the fade starts the new picture at alpha 0
          // and leaves the rest to a view animation, which has no frames to run
          // in while this screen is not the one on top. The glyph underneath
          // already covers the wait, so there is nothing to smooth over.
          //
          // The prefetch after an upload writes to both caches; reading from
          // only one of them would make that warm-up a download all over again.
          cachePolicy="memory-disk"
          onError={(event) => onError(source.uri, event)}
          style={box}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.fill,
    overflow: 'hidden',
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  glyph: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
