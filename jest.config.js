module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  testEnvironmentOptions: {
    url: "http://localhost:3000"
  }
};
