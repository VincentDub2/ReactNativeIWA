module.exports = {
    preset: 'react-native',
    setupFiles: ['./jest.setup.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native|react-native-.*|@react-navigation)/)',
    ],
};
