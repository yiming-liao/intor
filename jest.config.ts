import type { Config } from "jest";

// Add any custom config to be passed to Jest
const config: Config = {
  preset: "ts-jest",

  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // testEnvironment: "node",
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/__test__/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default config;
