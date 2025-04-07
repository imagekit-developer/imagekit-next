import { buildSrc, SrcOptions, Transformation } from "@imagekit/javascript";
import NextImage, { ImageProps } from "next/image";
import React, { useContext } from "react";
import { ImageKitContext } from "../provider/ImageKit";

export interface IKImage {
  src: SrcOptions["src"];
  urlEndpoint?: SrcOptions["urlEndpoint"];
  queryParameters?: SrcOptions["queryParameters"]
  transformation?: SrcOptions["transformation"];
  transformationPosition?: SrcOptions["transformationPosition"];
}

export const Image = (props: Omit<ImageProps, "src"> & IKImage) => {
  if (props.loader) {
    if (process.env.NODE_ENV !== "production") {
      console.warn('loader prop is ignored by ImageKit Image component.')
    }
  }

  const contextValues = useContext(ImageKitContext);

  // Its important to extract the ImageKit specific props from the props, so that we can use the rest of the props as is in the NextImage component
  const { transformation = [], unoptimized = false, quality, src = "", queryParameters, urlEndpoint, transformationPosition, publicKey, ...nonIKParams } = {
    ...contextValues, // Default values from context
    ...props // Override with props
  };

  if (!urlEndpoint || urlEndpoint.trim() === "") {
    if (process.env.NODE_ENV !== "production") {
      console.error("urlEndpoint is neither provided in this component nor in the ImageKitContext, skipping transformation.");
    }
    return null;
  }

  // Do not mutate original transformation array from the props
  const finalTransformation = [...transformation];

  let propsTransformation = {} as Transformation;

  if (quality) {
    const parsedQuality = Number(quality);
    if (!isNaN(parsedQuality)) {
      propsTransformation.quality = parsedQuality
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.error('Invalid quality value, skipping transformation.');
      }
    }
  }

  // Return original file without any transformation or optimization to match the behavior of NextImage
  if (unoptimized) {
    return (
      <NextImage
        src={buildSrc(
          {
            urlEndpoint,
            src,
            queryParameters,
            transformation: [
              {
                "raw": "orig-true"
              }
            ]
          }
        )}
        unoptimized={true}
        {...nonIKParams}
      />
    )
  }

  const finalSrcWithoutTransformation = buildSrc({
    urlEndpoint,
    queryParameters,
    src,
  });

  return (
    <NextImage
      src={finalSrcWithoutTransformation}
      {...nonIKParams}
      loader={({ src, width }) => {
        return buildSrc({
          urlEndpoint,
          src,
          transformation: [...finalTransformation, { ...propsTransformation, width }],
        });
      }}
    />
  )
};