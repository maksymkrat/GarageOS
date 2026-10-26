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

export interface PhotoSource {
  uri: string;
  headers?: Record<string, string>;
}

interface VehicleImageProps {
  source: PhotoSource | null;
  style?: StyleProp<ViewStyle>;
  glyph?: number;
}

// The square carries the size and the photo lies over it. Sizing the image
// from the frame instead left a replaced photo invisible until the screen was
// built again, and so does `transition`: it starts the picture at alpha 0 and
// leaves the rest to an animation that gets no frames while the screen is not
// on top. The focus key rebuilds the view for the same reason.
export function VehicleImage({ source, style, glyph = 48 }: VehicleImageProps) {
  const [failed, setFailed] = useState<string | null>(null);

  const focused = useIsFocused();

  const broken = source !== null && failed === source.uri;

  function onError(uri: string, { error }: ImageErrorEventData) {
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
          style={[styles.over, style as StyleProp<ImageStyle>]}
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
