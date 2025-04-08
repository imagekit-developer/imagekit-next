const DEFAULT_TIME_DIFF = 60 * 30; // 30 minutes
import crypto from "crypto";

export interface GenerateAuthOptions {
  privateKey: string;
  publicKey: string;
  token?: string;
  expire?: number;
}

export interface AuthResponse {
  token: string;
  signature: string;
  expire: number;
}

/**
 * This function generates the authentication parameters required for uploading files to ImageKit.
 * It is intended to be used on the server-side only.
 * 
 * @param {GenerateAuthOptions} options - The options for generating the authentication parameters.
 * @param {string} options.privateKey - The private key for your ImageKit account.
 * @param {string} options.publicKey - The public key for your ImageKit account.
 * @param {string} [options.token] - An optional token. If not provided, a new UUID will be generated.
 * @param {number} [options.expire] - An optional expiration time in seconds. If not provided, it defaults to 30 minutes from the current time.
 * @returns {AuthResponse} - The authentication parameters including token, signature, and expiration time.
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
    .update(authResponse.token + String(authResponse.expire))
    .digest("hex");

  return {
    expire: Number(authResponse.expire),
    token: authResponse.token,
    signature,
  };
};
