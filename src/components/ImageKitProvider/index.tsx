import React, { createContext } from "react";
import ImageKit from "imagekit-javascript";
import ImageKitProviderProps, { ImageKitProviderExtractedProps } from "./props";

// Create the context
export const ImageKitContext = createContext<ImageKitProviderExtractedProps>({});

/**
 * Provides a container for ImageKit components. Any option set in ImageKitProvider will be passed to the children.
 *
 * @example
 *<ImageKitProvider  publicKey="<public key>" urlEndpoint="url link">
 *    <!-- other tags -->
 *    <Image src={link}/>
 *</ImageKitProvider>
 */
const ImageKitProvider = (props: React.PropsWithChildren<ImageKitProviderProps>) => {
  const extractContextOptions = (mergedOptions: ImageKitProviderExtractedProps) => {
    const propKeys = ["publicKey", "urlEndpoint", "authenticator", "transformationPosition", "ikClient"] as Array<keyof ImageKitProviderExtractedProps>;

    for (const key in mergedOptions) {
      if (!propKeys.includes(key as keyof typeof mergedOptions)) {
        delete mergedOptions[key as keyof typeof mergedOptions];
      }
    }

    return mergedOptions;
  };

  const mergedOptions = {
    ...props,
  };

  const contextOptionsExtracted = extractContextOptions(mergedOptions);

  if (contextOptionsExtracted.urlEndpoint && contextOptionsExtracted.urlEndpoint.trim() !== "") {
    contextOptionsExtracted.ikClient = new ImageKit({
      urlEndpoint: contextOptionsExtracted.urlEndpoint,
      // @ts-ignore
      sdkVersion: "",
    });
  }

  return <ImageKitContext.Provider value={contextOptionsExtracted}>{props.children}</ImageKitContext.Provider>;
};

export default ImageKitProvider;
