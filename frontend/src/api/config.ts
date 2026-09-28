import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Port the backend (Express, app/backend) listens on. See app/backend/README.md.
 */
export const API_PORT = 4000;

/**
 * Resolves the host the phone/emulator running Expo Go should use to reach
 * the developer's machine (where the backend runs).
 *
 * `Constants.expoConfig?.hostUri` is populated by the Expo dev server with
 * something like "192.168.1.5:8081" (verified against the SDK 57 type
 * definitions shipped in node_modules/expo-constants — "Only present during
 * development using @expo/cli"). We only need the host part; our own
 * `API_PORT` is used instead of whatever port Metro is on.
 */
function resolveApiHost(): string {
  if (Platform.OS === 'web') {
    return 'localhost';
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) {
    return host;
  }

  console.warn(
    '[api/config] Não foi possível resolver o IP do servidor de desenvolvimento via ' +
      'Constants.expoConfig?.hostUri. Usando "localhost" como fallback — isso só ' +
      'funciona no emulador/simulador, não em um dispositivo físico na mesma rede.'
  );
  return 'localhost';
}

export const API_BASE_URL = `http://${resolveApiHost()}:${API_PORT}/api`;
