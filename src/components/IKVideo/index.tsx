import React, { useContext, useEffect, useRef, useState } from "react";
import { ImageKitContext } from "../ImageKitProvider";
import ImageKitProviderProps, { ImageKitProviderExtractedProps } from "../ImageKitProvider/props";
import IKVideoProps from "./props";

type IKVideoState = {
  currentUrl?: string;
  contextOptions: ImageKitProviderExtractedProps;
};

const IKVideo = (props: IKVideoProps & ImageKitProviderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<IKVideoState>({
    currentUrl: "",
    contextOptions: {},
  });

  // const { getIKClient } = useImageKitComponent({ ...props });
  const contextItems = useContext(ImageKitContext);

  useEffect(() => {
    // const { originalSrc } = getSrc(props, getIKClient(), contextItems);
    const originalSrc = props.src;
    setState((prevState) => ({ ...prevState, currentUrl: originalSrc, contextOptions: contextItems }));
  }, [contextItems, props]);

  const { currentUrl } = state;

  const { urlEndpoint, publicKey, authenticator, path, src, transformation, transformationPosition, queryParameters, ...restProps } = props;

  return (
    <video {...restProps} ref={videoRef} key={currentUrl}>
      <source src={currentUrl || undefined} type="video/mp4" />
    </video>
  );
};

export default IKVideo;
