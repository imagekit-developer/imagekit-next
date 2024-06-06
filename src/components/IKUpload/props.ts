import { UploadResponse } from 'imagekit-javascript/dist/src/interfaces';
import React from 'react';

type TransformationObject = {
  type: "transformation";
  value: string;
};

type GifToVideoObject = {
  type: "gif-to-video";
  value?: string;
};

type ThumbnailObject = {
  type: "thumbnail";
  value?: string;
};

type ABSObject = {
  type: "abs";
  value: string;
  protocol: "hls" | "dash";
};

type PostTransformation = TransformationObject | GifToVideoObject | ThumbnailObject | ABSObject;

type TransformationType = {
  pre?: string;
  post?: PostTransformation[];
};

interface BgRemoval {
  name: string
  options?: {
    bg_color?: string
    bg_image_url?: string
    add_shadow?: boolean
    semitransparency?: boolean
  }
}

interface AutoTag {
  name: string
  maxTags: number
  minConfidence: number
}

export type Extension = (BgRemoval | AutoTag)[];


export type OverrideValues = {
  fileName?: IKUploadProps['fileName'];
  useUniqueFileName?: IKUploadProps['useUniqueFileName'];
  tags?: IKUploadProps['tags'];
  folder?: IKUploadProps['folder'];
  isPrivateFile?: IKUploadProps['isPrivateFile'];
  customCoordinates?: IKUploadProps['customCoordinates'];
  extensions?: IKUploadProps['extensions'];
  webhookUrl?: IKUploadProps['webhookUrl'];
  overwriteFile?: IKUploadProps['overwriteFile'];
  overwriteAITags?: IKUploadProps['overwriteAITags'];
  overwriteTags?: IKUploadProps['overwriteTags'];
  overwriteCustomMetadata?: IKUploadProps['overwriteCustomMetadata'];
  customMetadata?: IKUploadProps['customMetadata'];
  transformation?: IKUploadProps['transformation'];
};

type IKUploadProps = {
    fileName?: string;
    useUniqueFileName?: boolean;
    tags?: Array<string>;
    folder?: string;
    isPrivateFile?: boolean;
    customCoordinates?: string;
    responseFields?: Array<string>;
    extensions?: Extension;
    webhookUrl?: string;
    overwriteFile?: boolean,
    overwriteAITags?: boolean,
    overwriteTags?: boolean,
    overwriteCustomMetadata?: boolean,
    customMetadata?: string | Record<string, string | number | boolean | Array<string | number | boolean>>;
    onError?: (err: Error) => void;
    onSuccess?: (res: UploadResponse) => void;
    onUploadStart?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadProgress?: (evt: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    validateFile?: (file: File) => boolean;
    transformation?: TransformationType;
    overrideParameters?: (file: File) => OverrideValues;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default IKUploadProps;