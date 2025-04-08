import { buildSrc, Transformation } from "@imagekit/javascript";
import NextImage, { ImageProps } from "next/image";
import React, { useContext } from "react";
import { SrcProps } from "../interface/index";
import { ImageKitContext } from "../provider/ImageKit";

export type IKImageProps = Omit<ImageProps, "src"> & SrcProps;

/**
 * The Image component is a wrapper around the Next.js Image component. It supports all the features of the Next.js Image component, along with additional features provided by ImageKit.
 * 
 * @example
 * ```jsx
 * import { Image } from "@imagekit/next";
 * <Image
 *  urlEndpoint="https://ik.imagekit.io/your_imagekit_id" // You can also set this in a parent ImageKitProvider component
 *  src="/default-image.jpg" // The path to the image in your ImageKit account
 *  alt="Default Image"
 *  width={500}
 *  height={500}
 *  transformation={[{ width: 500, height: 500 }]} // Add ImageKit transformations
 * />
 * ```
 */
export const Image = (props: IKImageProps) => {
  if (props.loader) {
    if (process.env.NODE_ENV !== "production") {
      console.warn('loader prop is ignored by ImageKit Image component.')
    }
  }

  const contextValues = useContext(ImageKitContext);

  // Its important to extract the ImageKit specific props from the props, so that we can use the rest of the props as is in the NextImage component
  const { transformation = [], unoptimized = false, quality, src = "", queryParameters, urlEndpoint, transformationPosition, loader, ...nonIKParams } = {
    ...contextValues, // Default values from context
    ...props // Override with props
  };

  if (!urlEndpoint || urlEndpoint.trim() === "") {
    if (process.env.NODE_ENV !== "production") {
      console.error("urlEndpoint is neither provided in this component nor in the ImageKitContext.");
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