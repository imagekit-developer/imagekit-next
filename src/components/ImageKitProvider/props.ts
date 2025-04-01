import ImageKit from "imagekit-javascript";
import { UrlOptions } from "imagekit-javascript/dist/src/interfaces";
import { TransformationPosition } from "imagekit-javascript/dist/src/interfaces/Transformation";


interface Props {
  publicKey?: string;
  urlEndpoint?: UrlOptions["urlEndpoint"];
  authenticator?: () => Promise<{ signature: string; expire: number; token: string }>;
  transformationPosition?: TransformationPosition;
}

export interface ImageKitProviderExtractedProps extends Props {
  ikClient?: ImageKit;
}

export default Props;
