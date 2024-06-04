import IKContextProps from "./props";

interface LQIP {
    active?: boolean;
    quality?: number;
    threshold?: number;
    blur?: number;
    raw?: string;
}

interface Props {
    width: number;
    height: number;
    alt: string;
    loading?: 'lazy';
    lqip?: LQIP | null;
    path?: string;
    src?: string;
    queryParameters?: Record<string, string | number >;
    transformation?: Array<Record<string, any>>;
    transformationPosition?: 'path' | 'query';
}

export default Props;
