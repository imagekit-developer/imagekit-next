import { Transformation } from "imagekit-javascript/dist/src/interfaces/Transformation";
import { ImageKitProviderExtractedProps } from "../components/ImageKitProvider/props";

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



export function hasProperty(array: Array<Transformation>, property: string) {
  return array.some((obj) => obj.hasOwnProperty(property));
}
