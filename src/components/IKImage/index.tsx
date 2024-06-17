import React, { useContext, useEffect, useRef, useState } from "react";
import NextImage, { ImageProps } from "next/image";
import IKImageProps from "./props";
import IKContextProps from "../IKContext/props";
import useImageKitComponent from "../ImageKitComponent";
import { ImageKitContext } from "../IKContext";
import { fetchEffectiveConnection, getIKElementsUrl, getSrc } from "../../utils/Utility";

const IKImage = (props: Omit<ImageProps, "src" | "loading"> & IKImageProps & IKContextProps) => {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);
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
    const { originalSrc: newOriginalSrc, lqipSrc: newLqipSrc } = getSrc(props, getIKClient(), contextOptions);
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
      if (window && "IntersectionObserver" in window && loading === "lazy") {
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
    width,
    height,
    alt,
    ...restProps
  } = props;

  return currentUrl != undefined ? (
    <NextImage
      width={width}
      loader={({ src }) => src}
      height={height}
      alt={alt}
      src={currentUrl ? currentUrl : ""}
      ref={imageRef}
      {...restProps}
      unoptimized
      loading="eager"
    />
  ) : (
    <img alt={props.alt || ""} src={currentUrl ? currentUrl : ""} ref={imageRef} {...restProps} />
  );
};

export default IKImage;
