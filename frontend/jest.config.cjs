module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^.+/services/timetableService$": "<rootDir>/src/services/__mocks__/timetableService.js",
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  moduleFileExtensions: ["js", "jsx"],
};