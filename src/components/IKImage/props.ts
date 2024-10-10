import { Transformation } from "imagekit-javascript/dist/src/interfaces/Transformation";
import { ImageProps } from "next/image";

interface LQIP {
  active?: boolean;
  quality?: number;
  threshold?: number;
  blur?: number;
  raw?: string;
}

interface PropsWithLqip {
  loading?: "lazy";
  lqip: LQIP;
  path?: string;
  src?: string;
  queryParameters?: Record<string, string | number>;
  transformation?: Array<Transformation>;
  transformationPosition?: "path" | "query";
}

interface PropsWithoutLqip {
  loading?: ImageProps["loading"];
  lqip?: null;
  path?: string;
  src?: string;
  queryParameters?: Record<string, string | number>;
  transformation?: Array<Transformation>;
  transformationPosition?: "path" | "query";
}

type Props = PropsWithoutLqip | PropsWithLqip;

export default Props;
