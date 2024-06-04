import React, { createContext } from "react";
import ImageKit from "imagekit-javascript";
import IKContextProps, { IKContextExtractedProps } from "./props";

// Create the context
export const ImageKitContext = createContext<IKContextExtractedProps>({});

/**
 * Provides a container for ImageKit components. Any option set in IKContext will be passed to the children.
 *
 * @example
 *<IKContext  publicKey="<public key>" urlEndpoint="url link">
 *    <!-- other tags -->
 *    <Image src={link}/>
 *</IKContext>
 */
const IKContext = (props: React.PropsWithChildren<IKContextProps>) => {
  const extractContextOptions = (mergedOptions: IKContextExtractedProps) => {
    const propKeys = ["publicKey", "urlEndpoint", "authenticator", "transformationPosition", "ikClient"] as Array<keyof IKContextExtractedProps>;

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

export default IKContext;
