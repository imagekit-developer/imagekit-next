import ImageKit from "imagekit-javascript";

export interface Props {
  publicKey?: string;
  urlEndpoint?: string;
  authenticator?: () => { signature: string; expire: string; token: string };
  transformationPosition?: "path" | "query";
}

export interface IKContextExtractedProps extends Props {
  ikClient?: ImageKit;
}

export default Props;
