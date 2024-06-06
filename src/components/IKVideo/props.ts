import { Transformation } from "imagekit-javascript/dist/src/interfaces/Transformation";

interface Props {
  path?: string;
  src?: string;
  queryParameters?: Record<string, string | number>;
  transformation?: Array<Transformation>;
  transformationPosition?: "path" | "query";
}

export default Props;
