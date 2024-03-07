import express from "express";
import anonymousRouter from "./anonymous";
import userRouter from "@routes/user";

const router = express.Router();

router.use("/", anonymousRouter);
router.use("/users", userRouter);

export default router;
