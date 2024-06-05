import ImageKit from "imagekit-javascript";

export interface Props {
  publicKey?: string;
  urlEndpoint?: string;
  authenticator?: () => Promise<{ signature: string; expire: number; token: string }>;
  transformationPosition?: "path" | "query";
}

export interface IKContextExtractedProps extends Props {
  ikClient?: ImageKit;
}

export default Props;
