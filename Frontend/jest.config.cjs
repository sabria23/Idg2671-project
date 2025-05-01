module.exports =  {
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper:{
        '\\.module\\.css$': 'identity-obj-proxy', 
    '\\.css$': '<rootDir>/src/__mocks__/styleMock.js',
    }
};