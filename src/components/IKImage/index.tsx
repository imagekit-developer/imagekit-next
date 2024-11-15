import React, { useContext, useEffect, useRef, useState } from "react";
import NextImage, { ImageProps } from "next/image";
import IKImageProps from "./props";
import ImageKitProviderProps from "../ImageKitProvider/props";
import useImageKitComponent from "../ImageKitComponent";
import { ImageKitContext } from "../ImageKitProvider";
import { fetchEffectiveConnection, getIKElementsUrl, getSrc, updateTransformation } from "../../utils/Utility";

const IKImage = (props: Omit<ImageProps, "src" | "loading" | "loader"> & IKImageProps & ImageKitProviderProps) => {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);
  const [imageProps, setImageProps] = useState<(Omit<ImageProps, "src" | "loading" | "loader" | "alt"> & IKImageProps & ImageKitProviderProps) | {}>(
    {}
  );
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [lqipSrc, setLqipSrc] = useState<string>("");
  const [originalSrcLoaded, setOriginalSrcLoaded] = useState<boolean>(false);
  const [observe, setObserve] = useState<IntersectionObserver | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [intersected, setIntersected] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { getIKClient } = useImageKitComponent({ ...props });
  const contextOptions = useContext(ImageKitContext);

  useEffect(() => {
    const { originalSrc: newOriginalSrc, lqipSrc: newLqipSrc } = getSrc(
      { ...props, transformation: updateTransformation(props) },
      getIKClient(),
      contextOptions
    );
    setOriginalSrc(newOriginalSrc);
    setLqipSrc(newLqipSrc ? newLqipSrc : "");
    setInitialized(true);
  }, [contextOptions, props]);

  const updateImageUrl = async () => {
    const url = await getIKElementsUrl(props, {
      originalSrc,
      lqipSrc,
      intersected,
      contextOptions,
      initialzeState: initialized,
      originalSrcLoaded,
      observe,
    }); // Include intersected state
    if (url) {
      setCurrentUrl(url);
    }
  };

  const triggerOriginalImageLoad = () => {
    var img = new Image();
    img.onload = () => {
      setOriginalSrcLoaded(true);
    };
    img.src = originalSrc;
  };

  useEffect(() => {
    if (originalSrcLoaded) updateImageUrl();
  }, [originalSrcLoaded]);

  useEffect(() => {
    const image = imageRef.current;
    const { loading } = props;

    if (initialized) {
      if (window && "IntersectionObserver" in window && loading === "lazy" && lqip) {
        const connectionType = fetchEffectiveConnection();
        let rootMargin = "1250px";
        if (connectionType !== "4g") rootMargin = "2500px";
        const imageObserver = new IntersectionObserver(
          (entries) => {
            const el = entries[0];
            if (el && el.isIntersecting && !intersected) {
              setIntersected(true);
              setObserve((prevObserver) => {
                if (prevObserver) {
                  prevObserver.disconnect();
                }
                return undefined;
              });
              triggerOriginalImageLoad();
              updateImageUrl();
            }
          },
          {
            rootMargin: `${rootMargin} 0px ${rootMargin} 0px`,
          }
        );
        if (image) {
          imageObserver.observe(image);
          setObserve(imageObserver);
        }
      } else {
        setIntersected(true);
        triggerOriginalImageLoad();
        updateImageUrl();
      }
    }
    return () => {
      if (observe) {
        observe.disconnect();
      }
    };
  }, [props, originalSrc, lqipSrc]);

  const {
    urlEndpoint,
    authenticator,
    publicKey,
    loading,
    lqip,
    path,
    src,
    transformation,
    transformationPosition,
    queryParameters,
    alt,
    ...restProps
  } = props;
  const {
    fill,
    quality,
    priority,
    placeholder,
    blurDataURL,
    unoptimized,
    overrideSrc,
    onLoadingComplete,
    layout,
    objectFit,
    objectPosition,
    lazyBoundary,
    lazyRoot,
    ...restPropsWithoutImageProps
  } = restProps;

  useEffect(() => {
    // if height and width are there in transformation skip props height and width and add fill =true
    const updatedRestProps = restProps;
    if (transformation?.length && transformation.some((obj) => obj.hasOwnProperty("height") || obj.hasOwnProperty("width"))) {
      if (updatedRestProps.height) delete updatedRestProps["height"];
      if (updatedRestProps.width) delete updatedRestProps["width"];
      updatedRestProps["fill"] = true;
    }
    setImageProps(updatedRestProps);
  }, []);

  useEffect(() => {
    if (lqip?.active) console.warn("In [imagekitio-next], loading is set to eager when LQIP is used.");
  }, [lqip]);

  return currentUrl != undefined && Object.keys(imageProps).length ? (
    <NextImage
      loader={({ src }) => src}
      alt={alt}
      src={currentUrl ? currentUrl : ""}
      ref={imageRef}
      unoptimized
      loading={lqip?.active ? "eager" : loading}
      {...imageProps}
    />
  ) : (
    <img src={currentUrl ? currentUrl : undefined} ref={imageRef} {...restPropsWithoutImageProps} />
  );
};

export default IKImage;
