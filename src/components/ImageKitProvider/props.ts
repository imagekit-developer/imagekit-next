import ImageKit from "imagekit-javascript";

interface Props {
  publicKey?: string;
  urlEndpoint?: string;
  authenticator?: () => Promise<{ signature: string; expire: number; token: string }>;
  transformationPosition?: "path" | "query";
}

export interface ImageKitProviderExtractedProps extends Props {
  ikClient?: ImageKit;
}

export default Props;
