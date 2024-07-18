"use client";
import React, { useState, useRef } from "react";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekit-next";
import { AbortableFileInput, IKUploadResponse, UploadError } from "imagekit-next/dist/types/components/IKUpload/props";
import { Transformation } from "imagekit-javascript/dist/src/interfaces/Transformation";

interface ErrorType {
  uploadFileErr: string;
}

interface OverrideParameterType {
  fileNameOnLocalSystem: string;
}

function App() {
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
  const authenticationEndpoint = process.env.NEXT_PUBLIC_AUTHENTICATION_ENDPOINT;
  let reftest = useRef<AbortableFileInput>(null);
  const [error, setError] = useState<ErrorType>();
  const [isUploading, setIsUploading] = useState<boolean | null>(null);
  const [uploadProgress, setUploadProgress] = useState<ProgressEvent>();
  const [uploadedImageSource, setUploadedImageSource] = useState<string>();
  const [imageTr, setImageTr] = useState<Transformation[]>([
    {
      height: "200",
      width: "200",
    },
  ]);
  const [imageTransImageKitProvider, setImageTransImageKitProvider] = useState<Transformation[]>([
    {
      height: "300",
      width: "300",
    },
  ]);
  const [overrideParametersValue, setoverrideParametersValue] = useState<OverrideParameterType>();

  const path = "default-image.jpg";
  const videoUrlEndpoint = "https://ik.imagekit.io/demo/";
  const videoPath = "sample-video.mp4";

  const src = `${urlEndpoint}/${path}`;

  const onSuccess = (res: IKUploadResponse) => {
    console.log("Success");
    console.log(res);
    console.log(res.$ResponseMetadata.statusCode); // 200
    console.log(res.$ResponseMetadata.headers); // headers
    setUploadedImageSource(res.url);
    setIsUploading(false);
  };

  const onError = (err: UploadError) => {
    console.log("Error");
    console.log(JSON.stringify(err));
    setError({ uploadFileErr: err.message });
    setIsUploading(false);
  };

  const validateFileFunction = (file: File): boolean => {
    console.log("validating", file);
    if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      setError({ uploadFileErr: "File not Supported" });
      return false;
    }
    return true;
  };

  const authenticator = async () => {
    try {
      if (authenticationEndpoint) {
        // You can pass headers as well and later validate the request source in the backend, or you can use headers for any other use case.
        const response = await fetch(authenticationEndpoint);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
      } else throw new Error(`Authentication endpoint is required`);
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onUploadStart = (_: React.ChangeEvent<HTMLInputElement>): void => {
    setIsUploading(true);
  };

  const onUploadProgress = (e: ProgressEvent) => {
    setUploadProgress(e);
  };

  const onOverrideParameters = (file: File) => {
    setoverrideParametersValue({
      fileNameOnLocalSystem: file.name,
    });
    return {
      fileName: "overridden-file-name.jpg",
    };
  };

  return (
    <div className="App">
      <input
        type="text"
        className="state-value"
        value={JSON.stringify({
          error,
          isUploading,
          uploadProgress,
          uploadedImageSource,
          imageTr,
          overrideParametersValue,
        })}
        onChange={() => {}}
        style={{ display: "none" }}
      ></input>
      <h1>Hi! This is an ImageKit Next.js SDK Demo!</h1>

      <p>
        Directly using <code>IkImage</code>
      </p>
      <IKImage className='applied-to-transformation' urlEndpoint={urlEndpoint} width={200} height={200} quality={10} path={path} alt="test-image"/>

      <p>Dynamic transformation update directly using IKImage</p>
      <div className="relative large-dimension">
        <IKImage
          publicKey={publicKey}
          height={200} width={200}
          urlEndpoint={urlEndpoint}
          className={"img-transformation-direct"}
          path={path}
          transformation={imageTransImageKitProvider}
          alt="test-image"
        />
      </div>

      <div>
        <p>Click here to apply transformations on the above image</p>
        <button
          className={"btn-to-change-tr-direct"}
          onClick={() =>
            setImageTransImageKitProvider([
              {
                height: "200",
                width: "600",
                radius: "max",
              },
              {
                height: "200",
                width: "200",
                rotate: "180",
              },
            ])
          }
        >
          Click to apply transformations
        </button>
      </div>
      <br />

      <p>
        Using context <code>ImageKitProvider</code>
      </p>
      <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
        <p>Let&apos;s add an Image</p>
        <IKImage src={src} height={200} width={200} alt="test-image" />

        <p>Transformation - height and width manipulation</p>
        <div className="relative large-dimension">
          <IKImage className={"img-transformation"} height={200} width={200} path={path} transformation={imageTr} alt="test-image" />
        </div>
        <div>
          <p>Click here to apply max radius on above image </p>
          <button
            className={"btn-to-change-tr"}
            onClick={() =>
              setImageTr([
                {
                  height: "200",
                  width: "200",
                  radius: "max",
                },
              ])
            }
          >
            Click to apply radius
          </button>
        </div>
        <br />
        <p>Chained transformation</p>
        <div className="relative dimension">
          <IKImage
            path={path}
            transformation={[
              {
                height: "200",
                width: "200",
              },
              {
                rotation: "90",
              },
            ]}
            alt="test-image"
            height={200} width={200}
          />
        </div>

        <p>Lazy loading image</p>
        <div className="relative dimension">
          <IKImage
            className={"lazyload"}
            path={path}
            height={200} width={200}
            transformation={[
              {
                height: "200",
                width: "200",
              },
            ]}
            loading="lazy"
            alt="test-image"
          />
        </div>

        <p>Progressive image loading wihtout lazy loading</p>
        <div className="relative dimension">
          <IKImage
            className={"lqip"}
            height={200} width={200}
            path={path}
            transformation={[
              {
                height: "200",
                width: "200",
              },
            ]}
            onError={(e) => {}}
            lqip={{ active: true, quality: 20, blur: 10 }}
            alt="test-image"
          />
        </div>

        <p>Progressive image loading with lazy loading</p>
        <div className="relative dimension">
          <IKImage
            className={"lazyload-lqip"}
            height={200} width={200}
            path={path}
            transformation={[
              {
                height: "200",
                width: "200",
              },
            ]}
            loading="lazy"
            lqip={{ active: true, quality: 20, blur: 30 }}
            alt="test-image"
          />
        </div>
        <p>File upload along with upload API options - To use this funtionality please remember to setup the server</p>
        <IKUpload
          fileName="test.jpg"
          tags={["sample-tag1", "sample-tag2"]}
          customCoordinates={"10,10,10,10"}
          isPrivateFile={false}
          useUniqueFileName={true}
          responseFields={["tags"]}
          folder={"/sample-folder"}
          onSuccess={onSuccess}
          ref={reftest}
          className="file-upload-ik"
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          overrideParameters={onOverrideParameters}
          accept="image/*"
        />
        {isUploading !== null ? (
          <p>
            {isUploading
              ? `...Uploading (${
                  uploadProgress ? (uploadProgress.type ? ((uploadProgress.loaded / uploadProgress.total) * 100).toFixed(2) + "%)" : "") : ""
                }`
              : uploadedImageSource}
          </p>
        ) : (
          <></>
        )}
        {isUploading ? (
          <button
            onClick={() => {
              reftest.current?.abort();
              setIsUploading(null);
            }}
          >
            Cancel
          </button>
        ) : (
          <></>
        )}
        <p>Custom Upload Button</p>
        {reftest && <button onClick={() => reftest.current?.click()}>Upload</button>}

        <p>Your above uploaded file will appear here </p>
        {uploadedImageSource && (
          <div className="relative dimension">
            <IKImage
              urlEndpoint={urlEndpoint}
              height={200} width={200}
              src={uploadedImageSource}
              className="uploaded-img-ik"
              transformation={[
                {
                  height: "200",
                  width: "200",
                },
              ]}
              alt="test-image"
            />
          </div>
        )}

        <p>Upload invalid file</p>
        <IKUpload
          className={"file-upload-error"}
          folder={"/sample-folder"}
          onSuccess={onSuccess}
          onError={onError}
          accept="image/*"
          validateFile={validateFileFunction}
        />

        {error && error.hasOwnProperty("uploadFileErr") && (
          <p style={{ color: "red" }} className="upload-error-ik">
            {"File upload failed."}
          </p>
        )}
      </ImageKitProvider>

      <ImageKitProvider publicKey={publicKey} urlEndpoint={videoUrlEndpoint}>
        <p>Video Element</p>
        <IKVideo className="ikvideo-default" path={videoPath} transformation={[{ height: "200", width: "200" }]} controls={true} />

        <br />
        <p>Video with some advance transformation</p>
        <IKVideo
          className="ikvideo-with-tr"
          path={videoPath}
          transformation={[{ height: "200", width: "600", b: "5_red", q: "95" }]}
          controls={true}
        />
      </ImageKitProvider>
    </div>
  );
}

export default App;
