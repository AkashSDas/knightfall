/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["html", "text", "text-summary", "lcov"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    clearMocks: true,
};
