import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';
import Config from 'react-native-config';

// Mock des variables d'environnement
jest.mock('react-native-config', () => ({
    EXPO_PUBLIC_API_URL: 'http://localhost:8090/api/v1',
}));

// Mock des modules natifs si nécessaire
NativeModules.RNConfig = Config;
