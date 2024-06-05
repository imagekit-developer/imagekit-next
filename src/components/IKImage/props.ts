interface LQIP {
    active?: boolean;
    quality?: number;
    threshold?: number;
    blur?: number;
    raw?: string;
}

interface Props {
    loading?: 'lazy';
    lqip?: LQIP | null;
    path?: string;
    src?: string;
    queryParameters?: Record<string, string | number >;
    transformation?: Array<Record<string, any>>;
    transformationPosition?: 'path' | 'query';
}

export default Props;
