import { Alert } from 'react-native';

export function showPrototypeNotice(action: string) {
  Alert.alert(action, 'Цей крок ще не реалізований — дані працюють на моках.');
}
