import ImageKit from "imagekit-javascript";
import { Transformation } from "imagekit-javascript/dist/src/interfaces/Transformation";
import NextImage, { ImageProps } from "next/image";
import React, { useContext } from "react";
import { ImageKitContext } from "../ImageKitProvider";
import ImageKitProviderProps from "../ImageKitProvider/props";
import IKImageProps from "./props";

const IKImage = (props: Omit<ImageProps, "loader" | "src"> & IKImageProps & ImageKitProviderProps) => {
  console.log("rendering IKImage", props.id);
  // @ts-ignore
  if (props.loader) {
    console.error('loader prop is not supported in IKImage and will be ignored')
  }

  // Its important to extract the ImageKit specific props from the props, so that we can use the rest of the props as is in the NextImage component
  const { transformation = [], unoptimized = false, urlEndpoint, quality, src = "", queryParameters, transformationPosition, publicKey, authenticator, ikClient: ignore, ...nonIKParams } = {
    ...useContext(ImageKitContext), // first pick from context
    ...props // Override with props
  };

  if (!urlEndpoint || urlEndpoint.trim() === "") {
    throw new Error(
      'Set urlEndpoint either in ImageKitProvider or in IKImage component'
    )
  }

  const ikClient = new ImageKit({
    urlEndpoint
  });

  // Do not mutate original transformation array from the props
  const finalTransformation = [...transformation];

  let propsTransformation = {} as Transformation;

  if (quality) {
    const parsedQuality = Number(quality);
    if (!isNaN(parsedQuality)) {
      propsTransformation.quality = parsedQuality
    } else {
      console.warn('Invalid quality value, skipping transformation');
    }
  }

  const pathOrSrc = {} as any;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    pathOrSrc.src = src;
  } else {
    pathOrSrc.path = src;
  }

  // Return original file without any transformation or optimization to match the behavior of NextImage
  if (unoptimized) {
    return (
      <NextImage
        src={ikClient.url(
          {
            urlEndpoint,
            ...pathOrSrc,
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

  const finalSrcWithoutTransformation = ikClient.url({
    urlEndpoint,
    queryParameters,
    transformationPosition,
    ...pathOrSrc,
  });

  return (
    <NextImage
      src={finalSrcWithoutTransformation}
      {...nonIKParams}
      loader={({ src, width }) => {
        return ikClient.url({
          urlEndpoint,
          src,
          transformation: [...finalTransformation, { ...propsTransformation, width }],
        });
      }}
    />
  )
};

export default IKImage;
