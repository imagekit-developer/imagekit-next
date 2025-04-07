const DEFAULT_TIME_DIFF = 60 * 30; // 30 minutes
import crypto from "crypto";

export interface GenerateAuthOptions {
    privateKey: string;
    publicKey: string;
    token?: string;
    expire?: number | string;
}

export interface AuthResponse {
    token: string;
    signature: string;
    expire: string;
}

/**
 * Never use this function on client side code
 */
export const getUploadAuthParams = function ({ token, expire, publicKey, privateKey }: GenerateAuthOptions): AuthResponse {
    if (!privateKey || !publicKey) {
        throw new Error("privateKey and publicKey are required");
    }

    var defaultExpire = parseInt(String(new Date().getTime() / 1000), 10) + DEFAULT_TIME_DIFF;

    var authResponse = {
        token: token || crypto.randomUUID(),
        expire: expire || defaultExpire
    };

    var signature = crypto
        .createHmac("sha1", privateKey)
        .update(authResponse.token + authResponse.expire)
        .digest("hex");

    return {
        expire: String(authResponse.expire),
        token: authResponse.token,
        signature
    }
};