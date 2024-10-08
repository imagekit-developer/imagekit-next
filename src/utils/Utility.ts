import ImageKit from "imagekit-javascript";
import { TransformationPosition, UrlOptions } from "imagekit-javascript/dist/src/interfaces";
import ImageKitProviderProps, { ImageKitProviderExtractedProps } from "../components/ImageKitProvider/props";
import IKImageProps from "../components/IKImage/props";
import { Props as IKVideoProps } from "../components/IKVideo/props";
import { ImageProps } from "next/image";
import { Transformation } from "imagekit-javascript/dist/src/interfaces/Transformation";

export type IKImageState = {
  currentUrl?: string;
  originalSrc: string;
  lqipSrc?: string;
  originalSrcLoaded: boolean;
  intersected: boolean;
  contextOptions: ImageKitProviderExtractedProps;
  observe?: IntersectionObserver;
  initialzeState: boolean;
};

export const fetchEffectiveConnection = () => {
  try {
    return (navigator as any).connection.effectiveType;
  } catch (ex) {
    return "4g";
  }
};

export const areObjectsDifferent = <T>(prevProps: T, newProps: T, propsAffectingURL: Array<string>) => {
  for (let index = 0; index < propsAffectingURL.length; index++) {
    if (prevProps[propsAffectingURL[index] as keyof T] !== newProps[propsAffectingURL[index] as keyof T]) {
      return true;
    }
  }

  return false;
};
type GetSrcReturnType = { originalSrc: string; lqipSrc?: string };

export const getSrc = (
  { urlEndpoint, lqip, src, path, transformation, transformationPosition, queryParameters }: IKImageProps & ImageKitProviderProps & IKVideoProps,
  ikClient: ImageKit,
  contextOptions: ImageKitProviderExtractedProps
): GetSrcReturnType => {
  let options: UrlOptions;
  if (src) {
    options = {
      urlEndpoint: urlEndpoint || contextOptions.urlEndpoint,
      src,
      transformation: transformation || undefined,
      transformationPosition: (transformationPosition || contextOptions.transformationPosition || undefined) as TransformationPosition,
      queryParameters: queryParameters || {},
    };
  } else if (path) {
    options = {
      urlEndpoint: urlEndpoint || contextOptions.urlEndpoint,
      path,
      transformation: transformation || undefined,
      transformationPosition: (transformationPosition || contextOptions.transformationPosition || undefined) as TransformationPosition,
      queryParameters: queryParameters || {},
    };
  } else return { originalSrc: "" };

  const result: GetSrcReturnType = { originalSrc: ikClient.url(options) };
  if (lqip && lqip.active) {
    var quality = Math.round(lqip.quality || lqip.threshold || 20);
    var blur = Math.round(lqip.blur || 6);
    var newTransformation = options.transformation ? [...options.transformation] : [];
    if (lqip.raw && typeof lqip.raw === "string" && lqip.raw.trim() !== "") {
      newTransformation.push({
        raw: lqip.raw.trim(),
      });
    } else {
      newTransformation.push({
        quality: String(quality),
        blur: String(blur),
      });
    }
    result.lqipSrc = ikClient.url({
      ...options,
      transformation: newTransformation,
    });
  }

  return result;
};

export const getIKElementsUrl = ({ lqip = null, loading }: IKImageProps, { intersected, originalSrcLoaded, originalSrc, lqipSrc }: IKImageState) => {
  /*
      No lazy loading no lqip
        src=originalImage
      No lazy loading lqip
        src=lqip
        src=originalImage (when loaded)
      lazy loading and no lqip
        src=''
        onIntersect:
        src=originalImage
      lazy loading and lqip
        src=lqip
        onIntersect:
        src=originalImage (when loaded)
    */
  const isLqipActive = (lqip: IKImageProps["lqip"]) => lqip && lqip.active;

  if (loading !== "lazy" && !isLqipActive(lqip)) {
    return originalSrc;
  } else if (loading !== "lazy" && isLqipActive(lqip)) {
    if (originalSrcLoaded) {
      return originalSrc;
    } else {
      return lqipSrc;
    }
  } else if (loading === "lazy" && !isLqipActive(lqip)) {
    if (intersected) {
      return originalSrc;
    } else {
      return "";
    }
  } else {
    if (intersected && originalSrcLoaded) {
      return originalSrc;
    } else {
      return lqipSrc;
    }
  }
};

export function hasProperty(array: Array<Transformation>, property: string) {
  return array.some((obj) => obj.hasOwnProperty(property));
}

export const updateTransformation = ({
  width,
  height,
  transformation,
  src,
  path,
  quality,
}: IKImageProps & ImageKitProviderProps & Pick<ImageProps, "height" | "width" | "quality">) => {
  //if height and width are there in props and absent in transformation then add it to the transformatiion
  if ((src || path) && (width || quality || height)) {
    let transformationObject: Transformation = {};
    if (!(transformation?.length && (hasProperty(transformation, "height") || hasProperty(transformation, "width")))) {
      if (height) transformationObject["height"] = String(height);
      if (width) transformationObject["width"] = String(width);
    }
    if (!(transformation?.length && hasProperty(transformation, "quality")) && quality) transformationObject["quality"] = String(quality);
    if (Object.keys(transformationObject).length) {
      if (transformation?.length) transformation = [...transformation, transformationObject];
      else transformation = [transformationObject];
    }
  }
  return transformation;
};
