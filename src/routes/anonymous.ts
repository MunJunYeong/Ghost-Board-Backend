import express from "express";
import * as controller from "../controllers/anonymous";

const anonymousRouter = express.Router();

anonymousRouter.post("/login", controller.login);

export default anonymousRouter;
