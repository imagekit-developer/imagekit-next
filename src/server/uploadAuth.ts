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
 * This function is meant to be used only on the server.
 */
export const getUploadAuthParams = function ({
  token,
  expire,
  publicKey,
  privateKey,
}: GenerateAuthOptions): AuthResponse {
  // Optional: add a runtime check so that if the function ever runs on the client, it fails early.
  if (typeof window !== "undefined") {
    throw new Error("getUploadAuthParams is a server-side only function.");
  }

  if (!privateKey || !publicKey) {
    throw new Error("privateKey and publicKey are required");
  }

  const defaultExpire = Math.floor(Date.now() / 1000) + DEFAULT_TIME_DIFF;
  const authResponse = {
    token: token || crypto.randomUUID(),
    expire: expire || defaultExpire,
  };

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(authResponse.token + authResponse.expire)
    .digest("hex");

  return {
    expire: String(authResponse.expire),
    token: authResponse.token,
    signature,
  };
};
