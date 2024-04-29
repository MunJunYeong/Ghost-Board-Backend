import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1분 간격
    max: 20,
    handler(req, res) {
        // 제한 초과 시 콜백 함수
        res.status(429).json({
            code: 429,
            message: "Exceeded the limit of 20 requests per minute.",
        });
    },
});
