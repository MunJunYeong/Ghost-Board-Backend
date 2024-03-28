module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.(ts|tsx)"],
    // tsconfig에 정의해둔 path를 알기 위해서 이렇게 정의를 해야함
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@configs/(.*)$": "<rootDir>/src/configs/$1",
        "^@dtos/(.*)$": "<rootDir>/src/dtos/$1",
        "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
        "^@models/(.*)$": "<rootDir>/src/models/$1",
        "^@repo/(.*)$": "<rootDir>/src/repository/$1",
        "^@routes/(.*)$": "<rootDir>/src/routes/$1",
        "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
        "^@services/(.*)$": "<rootDir>/src/services/$1",
        "^@errors/(.*)$": "<rootDir>/src/common/errors/$1",
        "^@utils/(.*)$": "<rootDir>/src/common/utils/$1",
    },
    // 만약 테스트 파일 하나만 실행하려면 아래 명령어로 실행하기
    // jest --config jest.config.js {test_file_name}
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
