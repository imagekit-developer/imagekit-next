import { Transformation } from "imagekit-javascript/dist/src/interfaces/Transformation";
import React from "react";

export type Props = {
  path?: string;
  src?: string;
  queryParameters?: Record<string, string | number>;
  transformation?: Array<Transformation>;
  transformationPosition?: "path" | "query";
};

type PropsWithVideoElement = Props & React.VideoHTMLAttributes<HTMLVideoElement>;

export default PropsWithVideoElement;
