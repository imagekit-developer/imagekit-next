import ImageKit from "imagekit-javascript";
import NextImage, { ImageProps } from "next/image";
import React, { useContext } from "react";
import { ImageKitContext } from "../ImageKitProvider";
import ImageKitProviderProps from "../ImageKitProvider/props";
import IKImageProps from "./props";

const imageKitLoader = ({ src, width, ikClient, transformation, finalUrlEndpoint }: any) => {
  const url = ikClient.url({
    urlEndpoint: finalUrlEndpoint,
    src,
    transformation: transformation.concat(
      [{
        width: `${width},c-at_max`,
      }]
    )
  });
  return url;
}

const IKImage = (props: Omit<ImageProps, "loader" | "src"> & IKImageProps & ImageKitProviderProps) => {
  // @ts-ignore
  if (props.loader) {
    console.error('loader prop is not supported in IKImage and will be ignored')
  }

  let { urlEndpoint: urlEndpointViaContext, ikClient } = useContext(ImageKitContext);

  const { transformation = [], unoptimized = false, urlEndpoint, quality, src = "", queryParameters, transformationPosition, publicKey, authenticator, ...nonIKParams } = props;

  if (quality) {
    transformation.push({
      quality: quality.toString()
    });
  }

  const finalUrlEndpoint = urlEndpoint || urlEndpointViaContext;

  if (!finalUrlEndpoint || finalUrlEndpoint.trim() === "") {
    throw new Error(
      'Set urlEndpoint either in ImageKitProvider or in IKImage component'
    )
  }

  if (!ikClient) {
    ikClient = new ImageKit({
      urlEndpoint: finalUrlEndpoint,
    });
  }

  const pathOrSrc = {} as any;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    pathOrSrc.src = src;
  } else {
    pathOrSrc.path = src;
  }

  if (unoptimized) {
    return (
      <NextImage
        src={ikClient.url(
          {
            urlEndpoint: finalUrlEndpoint,
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

  const finalSrc = ikClient.url({
    urlEndpoint: finalUrlEndpoint,
    queryParameters,
    transformationPosition,
    ...pathOrSrc,
  });

  return (
    <NextImage
      src={finalSrc}
      {...nonIKParams}
      loader={({ src, width }) => {
        return imageKitLoader({
          src,
          width,
          ikClient,
          transformation,
          finalUrlEndpoint
        });
      }}
    />
  )
};

export default IKImage;
