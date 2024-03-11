export const DevEnvPath = ".env.development";
export const TestEnvPath = ".env.test";
export const ProdEnvPath = ".env.production";

export const GetEnvPath = (): string => {
  let envPath;
  switch (process.env.NODE_ENV?.trim()) {
    case "test":
      envPath = TestEnvPath;
      break;
    case "production":
      envPath = ProdEnvPath;
      break;
    default: // development
      envPath = DevEnvPath;
  }
  return envPath;
};
