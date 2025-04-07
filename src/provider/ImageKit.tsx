import React, { createContext } from "react";
import { SrcOptions } from "@imagekit/javascript";

export interface ImageKitProviderProps {
  publicKey?: string;
  urlEndpoint?: SrcOptions["urlEndpoint"];
  transformationPosition?: SrcOptions["transformationPosition"];
}

export const ImageKitContext = createContext<ImageKitProviderProps>({});

export const ImageKitProvider = (props: React.PropsWithChildren<ImageKitProviderProps>) => {
  const { publicKey, urlEndpoint, transformationPosition } = props;
  return <ImageKitContext.Provider value={{ publicKey, urlEndpoint, transformationPosition }}>{props.children}</ImageKitContext.Provider>;
};

