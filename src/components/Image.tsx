import { buildSrc, type Transformation } from "@imagekit/javascript";
import NextImage, { type ImageProps } from "next/image";
import React, { useContext } from "react";
import type { SrcProps } from "../interface";
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

  const isAbsoluteURL = src.startsWith("http://") || src.startsWith("https://");

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
  // Always keep src in the end
  if (unoptimized) {
    return (
      <NextImage
        unoptimized={true}
        {...nonIKParams}
        src={buildSrc(
          {
            urlEndpoint,
            src,
            queryParameters,
            transformationPosition,
            transformation: [
              {
                "raw": "orig-true"
              }
            ]
          }
        )}
      />
    )
  }

  // Don't pass transformation just yet as loader will take care of it along with width for srcset generation as per Next.js logic.
  const finalSrcWithoutTransformation = buildSrc({
    urlEndpoint,
    queryParameters,
    src,
  });

  return (
    // Always keep src in the end
    <NextImage
      loader={({ src, width }) => {
        // Since `src` inside loader is always absolute, `buildSrc` won't respect the `path` transformation position.
        // To fix this, if the original src prop isn't an absolute URL, remove `urlEndpoint` from this `src`
        // before calling `buildSrc`. Otherwise, leave it as is.
        const srcWithoutUrlEndpoint = !isAbsoluteURL ? src.replace(urlEndpoint, "") : src;
        const finalSrc = buildSrc({
          urlEndpoint,
          src: srcWithoutUrlEndpoint,
          transformationPosition,
          transformation: [
            ...finalTransformation,
            { ...propsTransformation, width, crop: "at_max" },
          ],
        });
        return finalSrc;
      }}
      {...nonIKParams}
      src={finalSrcWithoutTransformation}
    />
  )
};