import express from "express";
import { signJwt } from "../utils/jwtUtil";
import { SecretUtil } from "@crypto-jambot/secret-manager-utils";
import { makeRequest } from "../utils/requestUtils";
import { coreClient } from "../utils/kubeUtils";
import * as crypto from "crypto";
import { AuthenticationV1TokenRequest } from "@kubernetes/client-node";
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

authRoute.get("/kube-token", async (req, res) => {
    try {
        const { response, body } = await makeRequest(
            coreClient.createNamespacedServiceAccountToken(
                "default",
                "default",
                {
                    spec: {
                        audiences: ["default"],
                    },
                }
            )
        );
        res.status(response.statusCode as number).json({
            token: body.status?.token,
        });
    } catch (err: any) {
        console.log(err);
        res.status(err.statusCode).json(err.message);
    }
});
