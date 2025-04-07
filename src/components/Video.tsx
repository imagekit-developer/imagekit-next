import { buildSrc, SrcOptions } from "@imagekit/javascript";
import React, { useContext } from "react";
import { ImageKitContext } from "../provider/ImageKit";

export interface IKVideo {
  src: SrcOptions["src"];
  urlEndpoint?: SrcOptions["urlEndpoint"];
  queryParameters?: SrcOptions["queryParameters"]
  transformation?: SrcOptions["transformation"];
  transformationPosition?: SrcOptions["transformationPosition"];
}

export const Video = (props: React.VideoHTMLAttributes<HTMLVideoElement> & IKVideo) => {
  const contextValues = useContext(ImageKitContext);

  // Its important to extract the ImageKit specific props from the props, so that we can use the rest of the props as is in the video element
  const { transformation = [], unoptimized = false, src = "", queryParameters, urlEndpoint, transformationPosition, publicKey, ...nonIKParams } = {
    ...contextValues, // Default values from context
    ...props // Override with props
  };

  if (!urlEndpoint || urlEndpoint.trim() === "") {
    throw new Error(
      'Set urlEndpoint either in ImageKitProvider or in IKImage component'
    )
  }


  const finalSrc = buildSrc({
    urlEndpoint,
    src,
    transformation: [...transformation], // Do not mutate original transformation array from the props
    queryParameters
  });

  return (
    <video {...nonIKParams} src={finalSrc} />
  );
};
