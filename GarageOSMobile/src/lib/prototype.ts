import { Alert } from 'react-native';

/**
 * Flows the design shows but the mock backend does not implement yet — surfaced
 * explicitly so the prototype never looks silently broken.
 */
export function showPrototypeNotice(action: string) {
  Alert.alert(action, 'Цей крок ще не реалізований — дані працюють на моках.');
}
