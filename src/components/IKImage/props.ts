import { Transformation, TransformationPosition } from "imagekit-javascript/dist/src/interfaces/Transformation";

type QueryParamValue =
  | string
  | number
  | boolean
  | undefined;

type Props = {
  src: string;
  queryParameters?: Readonly<Record<string, QueryParamValue>>;
  transformation?: ReadonlyArray<Transformation>;
  transformationPosition?: TransformationPosition
}

export default Props;
