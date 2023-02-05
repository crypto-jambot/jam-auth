import express from "express";
import { signJwt } from "../utils/jwtUtil";
import { SecretUtil } from "@crypto-jambot/secret-manager-utils";
export const authRoute = express.Router();
const secretUtil = new SecretUtil();

authRoute.use("/", async (req, res, next) => {
    const key = req.headers["api-key"];
    const apiKey = await secretUtil.getSecretString(
        process.env.API_KEY_SECRET as string
    );
    if (key && key === apiKey) {
        next();
        return;
    }
    res.status(400).send("Unable to authenticate");
});

authRoute.get("/", async (req, res) => {
    res.status(200).json({ token: await signJwt() });
});
