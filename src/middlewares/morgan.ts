import morgan from "morgan";
import { logger } from "@configs/logger";
import { GetEnvPath, ProdEnvPath } from "@utils/path";

const format = () => {
  // production 환경이라면 combined format 사용 (be more specific)
  return GetEnvPath() === ProdEnvPath
    ? '[:remote-addr - :remote-user] ":method :url HTTP/:http-version" :status :response-time ms - :res[content-length] ":referrer" ":user-agent"'
    : `:method [url - :url] [status - :status] [response time - :response-time ms] - :res[content-length]`;
};

// 로그 작성을 위한 Output stream 옵션.
const stream = {
  write: (message: any) => {
    logger.info(message);
  },
};

// 로깅 스킵 여부
// 배포 환경 && status_code 400 이상일 경우에 log 저장
const skip = (_: any, res: any) => {
  if (GetEnvPath() === ProdEnvPath) {
    return res.statusCode < 400;
  }
  return false;
};

export const morganMiddleware = morgan(format(), { stream, skip });
