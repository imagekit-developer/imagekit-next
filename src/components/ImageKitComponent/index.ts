import React, { useContext } from 'react';
import ImageKit from 'imagekit-javascript';
import ImageKitProviderProps from '../ImageKitProvider/props';
import { ImageKitContext } from '../ImageKitProvider';

 const useImageKitComponent= <T = void>(props: React.PropsWithChildren & ImageKitProviderProps & T):{getIKClient:() => ImageKit} => {
  const contextOptions = useContext(ImageKitContext);

  const getIKClient = (): ImageKit => {
    if (contextOptions && contextOptions.ikClient) {
      return contextOptions.ikClient;
    }

    let { urlEndpoint }: { urlEndpoint?: string | null } = props;
    urlEndpoint = urlEndpoint || (contextOptions && contextOptions.urlEndpoint);

    if (!urlEndpoint || urlEndpoint.trim() === "") {
      throw new Error("Missing urlEndpoint during initialization");
    }

    const ikClient = new ImageKit({
      urlEndpoint: urlEndpoint,
      // @ts-ignore
      sdkVersion: "",
    });

    return ikClient;
  };

  return {getIKClient};
}

export default useImageKitComponent;