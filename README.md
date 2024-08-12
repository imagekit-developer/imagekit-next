[<img width="250" alt="ImageKit.io" src="https://raw.githubusercontent.com/imagekit-developer/imagekit-javascript/master/assets/imagekit-light-logo.svg"/>](https://imagekit.io)

# ImageKit.io Next.js SDK

[![Node CI](https://github.com/imagekit-developer/imagekit-next/workflows/Node%20CI/badge.svg)](https://github.com/imagekit-developer/imagekit-next/)
[![npm version](https://img.shields.io/npm/v/imagekitio-next)](https://www.npmjs.com/package/imagekitio-next)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

ImageKit Next.js SDK allows you to resize, optimize, deliver, and upload images and videos in your Next.js application.

[ImageKit](https://imagekit.io) is a complete media storage, optimization, and transformation solution that comes with an image and video CDN. It can be integrated with your existing infrastructure - storage like AWS S3, web servers, your CDN, and custom domain names, allowing you to deliver optimized images in minutes with minimal code changes.

## Installation

Add `imagekitio-next` to your project by executing one of the following commands:

```shell
npm install --save imagekitio-next
```

or

```shell
yarn add imagekitio-next
```

## Usage

### Initialization

Import components in your code:

```js
import { IKImage, IKVideo, ImageKitProvider, IKUpload, ImageKitContext } from 'imagekitio-next'
```

### Pages Router (/src)

By default, `imagekitio-next` fully supports the included components in the `src` directory without any additional setup.

### App Router (/app)

The components in the app directory are, by default, React Server-Side Components (RSCs), but not everything can be done server-side. That's where Client components come in.

`imagekitio-next` provides components that operate exclusively on the client side.

When using the SDK for the first time, you might enter either of the following errors.

`Error: (0 , react__WEBPACK_IMPORTED_MODULE_0__.createContext) is not a function`

or

`You're importing a component that needs createContext. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.`

To simply fix this, you can force the component or the page to operate solely on Client Side by adding "use client"; directive at the start of the file, you can read more about it here [Using Client Components in Next.js](https://nextjs.org/docs/app/building-your-application/rendering/client-components#using-client-components-in-nextjs).

### Allowing images to be loaded from trusted external URLs

To protect your application from malicious users, configuration is required to use external images. The `remotePatterns` configuration in Next.js specifies the sources allowed to load images via external URLs. This enhances security by preventing unauthorized image sources, which could potentially expose the application to vulnerabilities like cross-site scripting (XSS) or data theft. By defining a whitelist of trusted image sources, developers can ensure that only images from these sources are loaded, thereby safeguarding the application. For more details, refer to the [Next.js documentation](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns).

`next.config.js`
```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: '',
      },
    ],
  },
}
```


### Examples

#### Image & video rendering and transformations
```js
<ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
  // Render an image using a relative path - https://ik.imagekit.io/your_imagekit_id/default-image.jpg
  <IKImage path="/default-image.jpg" width={200} height={200} alt="Alt text"/>

  // Overriding urlEndpoint defined in parent ImageKitProvider - https://www.custom-domain.com/default-image.jpg
  <IKImage urlEndpoint="https://www.custom-domain.com" path="/default-image.jpg" width={200} height={200} alt="Alt text"/>

  // Render an image using an absolute URL - https://www1.custom-domain.com/default-image.jpg?tr=w-100
  <IKImage src="https://www1.custom-domain.com/default-image.jpg?tr=w-100" width={200} height={200} alt="Alt text"/>

  // Height and width manipulation - https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200/default-image.jpg
  <IKImage path="/default-image.jpg" transformation={[{
    "height": "200",
    "width": "200"
  }]} alt="Alt text" />

  // Chained transformation - https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200:rt-90/default-image.jpg
  <IKImage path="/default-image.jpg" transformation={[{
    "height": "200",
    "width": "200",
  },
  {
    "rotation": "90"
  }]} alt="Alt text"/>

  // Video element with basic transformation, reduced quality by 50% using q:50
  <IKVideo
    path={'/default-video.mp4'}
    transformation={[{ height: 200, width: 200, q: 50 }]}
    controls={true}
  />
</ImageKitProvider>
```

#### Image lazy loading and low-quality placeholder
```js
<ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
  // Lazy loading image
  <IKImage
    path="/default-image.jpg"
    transformation={[{
      "height": "200",
      "width": "200"
    }]}
    loading="lazy"
    alt="Alt text"
  />

  /*
     Low-quality image placeholder
     Will first load https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200:q-20,bl-6/default-image.jpg, while the original image, i.e., https://ik.imagekit.io/your_imagekit_id/tr:h-200,w-200/default-image.jpg is being loaded in the background.
  */
  <IKImage
    path="/default-image.jpg"
    transformation={[{
      "height": "200",
      "width": "200"
    }]}
    lqip={{ active: true }}
    alt="Alt text"
  />

  // Low-quality image placeholder with custom quality and blur values
  <IKImage
    path="/default-image.jpg"
    transformation={[{
      "height": "200",
      "width": "200"
    }]}
    lqip={{ active: true, quality: 20, blur: 10 }}
    alt="Alt text"
  />

  // Low-quality image placeholder and lazy loading of original image in the background
  <IKImage
    path="/default-image.jpg"
    transformation={[{
      "height": "200",
      "width": "200"
    }]}
    loading="lazy"
    lqip={{ active: true }}
    alt="Alt text"
  />
</ImageKitProvider>
```

#### File upload example
```js
// Ensure you pass publicKey, urlEndpoint, and authenticator function to the parent ImageKitProvider component or to the IKUpload component directly.
<ImageKitProvider
  publicKey="your_public_api_key"
  urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
  authenticator={()=>Promise} 
  // This promise  resolves with an object containing the necessary security parameters i.e `signature`, `token`, and `expire`.
  >
  <IKUpload
    onError={onError}
    onSuccess={onSuccess}
  />

  // Passing different upload API options
  <IKUpload
    fileName="file-name.jpg"
    tags={["sample-tag1", "sample-tag2"]}
    customCoordinates={"10,10,10,10"}
    isPrivateFile={false}
    useUniqueFileName={true}
    responseFields={["tags"]}
    folder={"/sample-folder"}
    ref={uploadRef}
    onError={onError} onSuccess={onSuccess}
    transformation={{
      pre: 'l-text,i-Imagekit,fs-50,l-end', 
      post: [
        {
          'type': 'transformation', 
          'value': 'w-100'
        }
      ]
    }}
    checks={`"file.size" < "1mb"`} // To run server side checks before uploading files. Notice the quotes around file.size and 1mb.
  />
</ImageKitProvider>
```

## Demo application
* The official step-by-step Next.js quick start guide - https://imagekit.io/docs/integration/next

## Components

The library includes 6 Components:

* [`ImageKitProvider`](#ImageKitProvider) is used to define options such as `urlEndpoint`, `publicKey`, or `authenticator` for all child components. It does not render any UI elements.
* `IKImage` for [image resizing](#image-resizing), this utilizes next/image and renders an `<img>` tag.
* `IKVideo` for [video resizing](#video-resizing), this renders a `<video>` tag.
* `IKUpload`for client-side [file uploading](#file-upload), this renders a `<input type="file">` tag.
* `ImageKitClient` for [Core SDK](#imagekitclient), this exposes methods from [ImageKit javascript SDK](https://github.com/imagekit-developer/imagekit-javascript) like url and upload.
* [`ImageKitContext`](#ImageKitContext) is a context used to provide access to options such as `urlEndpoint`, `publicKey`, `ikClient` or `authenticator` to child components within `ImageKitProvider`. It does not render any UI elements.

## ImageKitProvider

To use this SDK, you need to provide it with a few configuration parameters. You can use a parent `ImageKitProvider` component to define common options for all children `IKImage`, `IKVideo` or `IKupload` components. For example:

```js
<ImageKitProvider
  urlEndpoint="https://ik.imagekit.io/your_imagekit_id"  // Required. Default URL-endpoint is https://ik.imagekit.io/your_imagekit_id
  publicKey="your_public_api_key" // optional
  transformationPosition="path" // optional
  authenticator={()=>Promise} // optional
  <IKImage path="/default-image.jpg" width={200} height={200} alt="Alt text"/>
</ImageKitProvider>
```

* `urlEndpoint` is required to use the SDK. You can get URL-endpoint from your ImageKit dashboard - https://imagekit.io/dashboard/url-endpoints.
* `publicKey` and `authenticator` parameters are required if you want to use the SDK for client-side file upload. You can get these parameters from the developer section in your ImageKit dashboard - https://imagekit.io/dashboard/developer/api-keys.
* `transformationPosition` is optional. The default value for this parameter is `path`. Acceptable values are `path` & `query`

> Note: Do not include your [private key](https://imagekit.io/docs/api-keys#private-key) in any client-side code.

## Image resizing

The `IKImage` component acts as a wrapper around the [Next.js Image component](https://nextjs.org/docs/pages/api-reference/components/image). This allows you to access all the built-in features of the Next.js Image component. The `IKImage` component is used for rendering and manipulating images in real time. It accepts the following props:

| Prop                   | Type             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :--------------------- | :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| urlEndpoint            | String           | Optional. The base URL to be appended before the path of the image. If not specified, the URL-endpoint specified in the parent `ImageKitProvider` component is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| path                   | String           | Conditional. This is the path at which the image exists. For example, `/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| src                    | String           | Conditional. This is the complete URL of an image already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg`. Either the `path` or `src` parameter needs to be specified for URL generation.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| transformation         | Array of objects | Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). Different steps of a [chained transformation](https://imagekit.io/docs/transformations#chained-transformations) can be specified as the Array's different objects. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it is applied in the URL as it is. |
| transformationPosition | String           | Optional. The default value is `path`, which places the transformation string as a URL path parameter. It can also be specified as `query`, which adds the transformation string as the URL's query parameter i.e.`tr`. If you use the `src` parameter to create the URL, then the transformation string is always added as a query parameter.                                                                                                                                                                                                                                                                                                                    |
| queryParameters        | Object           | Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs.                                                                                                                                                                                                                                                                                                                                                                                                                |
| loading                | String           | Optional. Pass `lazy` to lazy load images. Note: Component does not accept change in this value after it has mounted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| lqip                   | Object           | Optional. You can use this to show a low-quality blurred placeholder while the original image is being loaded e.g. `{active:true, quality: 20, blur: 6, raw: "n-lqip_named_transformation"`}. The default value of `quality` is `20`, and `blur` is `6`. If `raw` transformation is provided, SDK uses that and ignores the `quality` and `blur` parameters. <br /> Note: Component does not accept change in this value after it has mounted.                                                                                                                                            |
| width                   | String or Number           | Required, except for [statically imported images](https://nextjs.org/docs/app/building-your-application/optimizing/images#local-images) or images with the [fill property](https://nextjs.org/docs/app/api-reference/components/image#fill). The `width` property represents the rendered width in pixels, so it will affect how large the image appears.                                                                                                                                                                                                                    |
| height                   | String or Number           | Required, except for [statically imported images](https://nextjs.org/docs/app/building-your-application/optimizing/images#local-images) or images with the [fill property](https://nextjs.org/docs/app/api-reference/components/image#fill). The `height` property represents the rendered height in pixels, so it will affect how large the image appears.                                                                                                                                                                  |
| alt                   | String       | Required. The `alt` property is used to describe the image for screen readers and search engines. It is also the fallback text if images have been disabled or an error occurs while loading the image.                                                                                                                                                                       |


In addition to these, you can use all the options supported by `next/image` except for `loading`, `loader` and `src`. You can find the full list of supported `next/image` props [here](https://nextjs.org/docs/pages/building-your-application/optimizing/images#props).

The `height` and `width` properties are ignored if they are included in the `transformation` parameter passed to `IKImage`, and `fill={true}` is applied. In such cases, where the `transformation` contains `height` or `width`, a bounding element with appropriate dimensions should be provided, and its position should be set to one of `absolute`, `fixed`, or `relative`. If `height`, `width`, or `quality` is specified only as a prop and not in the `transformation`, it is automatically applied in the `transformation`. Please refer to the example below.

```js
<div style={{ position: "relative", width: "200", height: "200" }}>
  <IKImage path={path} transformation={[{ height: "200", width: "200" }]} alt="test-image" />
</div>
```

### Basic resizing examples

```js
<ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
  // Image from related file path with no transformations - https://ik.imagekit.io/your_imagekit_id/default-image.jpg
  <IKImage
    path="/default-image.jpg" height={200} width={300} alt="Alt text"
  />

  // Image resizing - https://ik.imagekit.io/your_imagekit_id/tr:w-h-300,w-400/default-image.jpg
  <IKImage
    path="/default-image.jpg"
    transformation={[{
      height:"300",
      width:"400"
    }]}
    alt="Alt text"
  />

  // Loading image from an absolute file path with no transformations - https://www.custom-domain.com/default-image.jpg
  <IKImage
    src="https://www.custom-domain.com/default-image.jpg" height={200} width={200} alt="Alt text"
  />

  // Using a new transformation parameter which is not there in this SDK yet - https://ik.imagekit.io/your_imagekit_id/tr:custom-value/default-image.jpg
  <IKImage
    path="/default-image.jpg"
    transformation={[{
      custom: 'value'
    }]}
    height={200} 
    width={200} 
    alt="Alt text"
  />
</ImageKitProvider>
```

The `transformation` prop is an array of objects. Each object can have the following properties. When you specify more than one object, each object is added as a chained transformation. For example:

```js
// It means first resize the image to 400x400 and then rotate 90 degree
transformation = [
  {
    height: 400,
    width: 400
  },
  {
    rotation: 90
  }
]
```

See the complete list of transformations supported in ImageKit [here](https://imagekit.io/docs/image-transformation). The SDK gives a name to each transformation parameter e.g. `height` for `h` and `width` for `w` parameter. It makes your code more readable. If the property does not match any of the following supported options, it is added as it is.

### Adding overlays

ImageKit.io enables you to apply overlays to [images](https://imagekit.io/docs/add-overlays-on-images) and [videos](https://imagekit.io/docs/add-overlays-on-videos) using the raw parameter with the concept of [layers](https://imagekit.io/docs/transformations#overlay-using-layers). The raw parameter facilitates incorporating transformations directly in the URL. A layer is a distinct type of transformation that allows you to define an asset to serve as an overlay, along with its positioning and additional transformations.

**Text as overlays**

You can add any text string over a base video or image using a text layer (l-text).

For example:

```js
<IKImage
    path="/default-image.jpg"
    transformation={[{ "width": "400", "height": "300" },{ "raw": "l-text,i-Imagekit,fs-50,l-end" }]}
    alt="Alt text"
/>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/tr:h-300,w-400,l-text,i-Imagekit,fs-50,l-end/default-image.jpg
```

**Image as overlays**

You can add an image over a base video or image using an image layer (l-image).

For example:

```js
<IKImage
    path="/default-image.jpg"
    transformation={[{ "width": "400", "height": "300" },{ "raw": "l-image,i-default-image.jpg,w-100,b-10_CDDC39,l-end" }]}
    alt="Alt text"
/>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/tr:h-300,w-400,l-image,i-default-image.jpg,w-100,b-10_CDDC39,l-end/default-image.jpg
```

**Solid color blocks as overlays**

You can add solid color blocks over a base video or image using an image layer (l-image).

For example:

```js
<IKVideo
    path="/img/sample-video.mp4"
    transformation={[{ "width": 400, "height": 300 },{ "raw": "l-image,i-ik_canvas,bg-FF0000,w-300,h-100,l-end" }]}
/>
```
**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/tr:h-300,w-400,l-image,i-ik_canvas,bg-FF0000,w-300,h-100,l-end/img/sample-video.mp4
```


### Arithmetic expressions in transformations

ImageKit allows use of [arithmetic expressions](https://imagekit.io/docs/arithmetic-expressions-in-transformations) in certain dimension and position-related parameters, making media transformations more flexible and dynamic.

For example:

```js
<IKImage
    path="/default-image.jpg"
    transformation={[{
        "height": "ih_div_2",
        "width": "iw_div_4",
        "border": "cw_mul_0.05_yellow"
    }]}
    alt="Alt text"
/>
```

**Sample Result URL**
```
https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=w-iw_div_4,h-ih_div_2,b-cw_mul_0.05_yellow
```

### List of supported transformations
<details>
<summary>Expand</summary>

| Supported Transformation Name | Translates to parameter                                       |
| ----------------------------- | ------------------------------------------------------------- |
| height                        | h                                                             |
| width                         | w                                                             |
| aspectRatio                   | ar                                                            |
| quality                       | q                                                             |
| crop                          | c                                                             |
| cropMode                      | cm                                                            |
| x                             | x                                                             |
| y                             | y                                                             |
| focus                         | fo                                                            |
| format                        | f                                                             |
| radius                        | r                                                             |
| background                    | bg                                                            |
| border                        | b                                                             |
| rotation                      | rt                                                            |
| blur                          | bl                                                            |
| named                         | n                                                             |
| progressive                   | pr                                                            |
| lossless                      | lo                                                            |
| trim                          | t                                                             |
| metadata                      | md                                                            |
| colorProfile                  | cp                                                            |
| defaultImage                  | di                                                            |
| dpr                           | dpr                                                           |
| effectSharpen                 | e-sharpen                                                     |
| effectUSM                     | e-usm                                                         |
| effectContrast                | e-contrast                                                    |
| effectGray                    | e-grayscale                                                   |
| effectShadow                  | e-shadow                                                      |
| effectGradient                | e-gradient                                                    |
| original                      | orig                                                          |
| raw                           | The string provided in raw will be added to the URL as it is. |

</details>

### Chained Transforms

Chained transforms make it easy to specify the order the transform is applied. For example:

```js
// Using chained transformation. First, resize and then rotate the image to 90 degrees.
<IKImage
  path="/default-image.jpg"
  transformation={[
    {
      height: 300,
      width: 400
    },
    {
      rotation: 90
    }
  ]}
  alt="Alt text"
/>
```

### Lazy loading images

You can lazy load images using the `loading` prop. When you use `loading="lazy"`, all images that are immediately viewable without scrolling load normally. Those far below the device viewport are only fetched when the user scrolls near them.

The SDK uses a fixed threshold based on the effective connection type to ensure that images are loaded early enough so that they have finished loading once the user scrolls near to them.

On fast connections (e.g 4G), the value of threshold is `1250px` and on slower connections (e.g 3G), it is `2500px`.

> You should always set the `height` and `width` of the image element to avoid [layout shift](https://www.youtube.com/watch?v=4-d_SoCHeWE) when lazy-loading images.

Example usage:

```js
// Lazy loading images
<IKImage
  path="/default-image.jpg"
  transformation={[
    {
      height:"300",
      width:"400"
    },
    {
      rotation:90
    }
  ]}
  loading="lazy"
  alt="Alt text"
/>
```

### Low-quality image placeholders (LQIP)
To improve user experience, you can use a low-quality blurred variant of the original image as a placeholder while the original image is being loaded in the background. Once the loading of the original image is finished, the placeholder is replaced with the original image.

```js
// Loading a blurred low quality image placeholder while the original image is being loaded
<IKImage
  path="/default-image.jpg"
  lqip={{active:true}}
  height={200} width={200} alt="Alt text"
/>
```

By default, the SDK uses the `quality:20` and `blur:6`. You can change this. For example:

```js
<IKImage
  path="/default-image.jpg"
  lqip={{active:true, quality: 40, blur: 5}}
  height={200} width={200} alt="Alt text"
/>
```

You can also specify a `raw` transformation if you want more control over the URL of the low-quality image placeholder. In this case, the SDK ignores `quality` and `blur` parameters.

```js
<IKImage
  path="/default-image.jpg"
  lqip={{active:true, raw: "n-lqip_named_transformation"}}
  height={200} width={200} alt="Alt text"
/>
```

### Combining lazy loading with low-quality placeholders
You have the option to lazy-load the original image only when the user scrolls near them. Until then, only a low-quality placeholder is loaded. This saves a lot of network bandwidth if the user never scrolls further down.

```js
// Loading a blurred low quality image placeholder and lazy-loading original when the user scrolls near them
<IKImage
  path="/default-image.jpg"
  transformation={[{height:"300",width:"400"},{rotation:90}]}
  lqip={{active:true}}
  loading="lazy"
  alt="Alt text"
/>
```

### Overriding urlEndpoint for a particular image
You can use `urlEndpoint` prop in an individual `IKImage` to change url for that image. For example:
```js
<ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
  // Render an image using parent ImageKitProvider urlEndpont - https://ik.imagekit.io/your_imagekit_id/default-image.jpg
  <IKImage path="/default-image.jpg" height={200} width={200} alt="Alt text"/>

  // Overriding urlEndpoint defined in parent ImageKitProvider - https://www.custom-domain.com/default-image.jpg
  <IKImage urlEndpoint="https://www.custom-domain.com" path="/default-image.jpg" height={200} width={200} alt="Alt text"/>
</ImageKitProvider>
```

## Video resizing

The `IKVideo` component renders a `video` tag. It is used for rendering and manipulating videos in real-time. `IKVideo` component accepts the following props:

| Prop                   | Type             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :--------------------- | :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| urlEndpoint            | String           | Optional. The base URL to be appended before the path of the video. If not specified, the URL-endpoint specified in the parent `ImageKitProvider` component is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/                                                                                                                                                                                                                                                      |
| path                   | String           | Conditional. This is the path at which the video exists. For example, `/path/to/video.mp4`. Either the `path` or `src` parameter needs to be specified for URL generation.                                                                                                                                                                                                                                                                                                        |
| src                    | String           | Conditional. This is the complete URL of a video already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/video.mp4`. Either the `path` or `src` parameter needs to be specified for URL generation.                                                                                                                                                                                                                                    |
| transformation         | Array of objects | Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name and the value should be specified as a key-value pair in the object. See list of [different tranformations](#list-of-supported-transformations). The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it gets applied as it is in the URL. |
| transformationPosition | String           | Optional. The default value is `path`, which places the transformation string as a path parameter in the URL. It can also be `query`, which adds the transformation string as the query parameter tr in the URL. If you use the src parameter to create the URL, then the transformation string is always added as a query parameter.                                                                                                                                             |
| queryParameters        | Object           | Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and are not necessarily related to ImageKit. Especially useful if you want to add some versioning parameters to your URLs.                                                                                                                                                                                                                                |

### Basic video resizing examples

```js
<ImageKitProvider urlEndpoint="https://ik.imagekit.io/demo/your_imagekit_id">
  // Video from related file path with no transformations - https://ik.imagekit.io/demo/your_imagekit_id/sample-video.mp4
  <IKVideo
    path="/sample-video.mp4"
  />
  // Video resizing - https://ik.imagekit.io/demo/your_imagekit_id/tr:w-h-300,w-400/sample-video.mp4
  <IKVideo
    path="/sample-video.mp4"
    transformation={[{
      height:300,
      width:400
    }]}
  />
  // Loading video from an absolute file path with no transformations - https://www.custom-domain.com/default-video.mp4
  <IKVideo
    src="https://www.custom-domain.com/default-video.mp4"
  />
  // Using a new transformation parameter which is not there in this SDK yet - https://ik.imagekit.io/demo/your_imagekit_id/tr:custom-value/sample-video.mp4
  <IKVideo
    path="/sample-video.mp4"
    transformation={[{
      custom: 'value'
    }]}
  />
</ImageKitProvider>
```

The `transformation` prop is an array of objects. Each object can have the following properties.

```js
// It means first resize the video to 400x400 and then rotate 90 degree
transformation = [
  {
    height: 400,
    width: 400,
    rt: 90
  }
]
```

### Adaptive Bitrate Streaming

Adaptive Bitrate Streaming (ABS) enhances the video streaming experience by adapting to various devices and connection speeds. It reduces buffering, enables quick start times, and ensures a seamless viewing experience, regardless of whether the connection is high-speed or low-speed. For more details on ABS and how to implement it in Next.js, please refer to this [blog](https://imagekit.io/blog/nextjs-video-player/#adaptive-bitrate-streaming).


## File upload

The SDK provides the `IKUpload` component to upload files to the [ImageKit Media Library](https://imagekit.io/docs/dam/overview). 

`IKUpload` component accepts the following props. These options are better explained in the [ImageKit Upload API](https://imagekit.io/docs/api-reference/upload-file/upload-file) documentation.

| Prop                    | Type                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                             |
| :---------------------- | :--------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fileName                | String                                                     | Optional. If not specified, the file system name is picked.                                                                                                                                                                                                                                                                                                                                                             |
| useUniqueFileName       | Boolean                                                    | Optional. Accepts `true` of `false`. The default value is `true`. Specify whether to use a unique filename for this file or not.                                                                                                                                                                                                                                                                                        |
| tags                    | Array of string                                            | Optional. Set the tags while uploading the file e.g. ["tag1","tag2"]                                                                                                                                                                                                                                                                                                                                                    |
| folder                  | String                                                     | Optional. The folder path (e.g. `/images/folder/`) in which the file has to be uploaded. If the folder doesn't exist before, a new folder is created.                                                                                                                                                                                                                                                                   |
| isPrivateFile           | Boolean                                                    | Optional. Accepts `true` of `false`. The default value is `false`. Specify whether to mark the file as private or not. This is only relevant for image type files                                                                                                                                                                                                                                                       |
| customCoordinates       | String                                                     | Optional. Define an important area in the image. This is only relevant for image-type files. To be passed as a string with the `x` and `y` coordinates of the top-left corner and `width` and `height` of the area of interest in the format `x,y,width,height`. For example - `10,10,100,100`                                                                                                                          |
| responseFields          | Array of string                                            | Optional. Values of the fields that you want upload API to return in the response. For example, set the value of this field to `["tags", "customCoordinates", "isPrivateFile"]` to get value of `tags`, `customCoordinates`, and `isPrivateFile` in the response.                                                                                                                                                       |
| extensions              | Array of object                                            | Optional. Array of object for [applying extensions](https://imagekit.io/docs/dam/overview#ai-extension-pricing) on the image.                                                                                                                                                                                                                                                                                                         |
| webhookUrl              | String                                                     | Optional. Final status of pending extensions will be sent to this URL.                                                                                                                                                                                                                                                                                                                                                  |
| overwriteFile           | Boolean                                                    | Optional. Default is true. If overwriteFile is set to false and useUniqueFileName is also false, and a file already exists at the exact location, upload API will return an error immediately.                                                                                                                                                                                                                          |
| overwriteAITags         | Boolean                                                    | Optional. Default is true. If set to true and a file already exists at the exact location, its AITags will be removed. Set overwriteAITags to false to preserve AITags.                                                                                                                                                                                                                                                 |
| overwriteCustomMetadata | Boolean                                                    | Optional. Default is true. If the request does not have customMetadata , overwriteCustomMetadata is set to true and a file already exists at the exact location, exiting customMetadata will be removed. In case the request body has customMetadata, setting overwriteCustomMetadata to false has no effect and request's customMetadata is set on the asset.                                                          |
| customMetadata          | Object                                                     | Optional. JSON key-value data to be associated with the asset.                                                                                                                                                                                                                                                                                                                                                          |
| ref                     | Reference                                                  | Optional. Forward reference to the core HTMLInputElement.                                                                                                                                                                                                                                                                                                                                                               |
| onUploadStart           | Function callback                                          | Optional. Called before the upload is started. The first and only argument is the HTML input's change event                                                                                                                                                                                                                                                                                                             |
| onUploadProgress        | Function callback                                          | Optional. Called while an upload is in progress. The first and only argument is the ProgressEvent                                                                                                                                                                                                                                                                                                                       |
| validateFile            | Function callback                                          | Optional. This function accepts the `File` object as an argument and exoects a Boolean return value. This is called before the upload is started to run custom validation. The first and only argument is the file selected for upload. If the callback returns `true`, the upload is allowed to continue. But, if it returns `false`, the upload is not done                                                           |
| overrideParameters      | Function callback                                          | Optional. This function accepts the `File` object as an argument and should return a JSON value, e.g., `{fileName: "new-file-name.jpg"}.` Use this to programmatically override `fileName`, `useUniqueFileName`, `tags`, `folder`, `isPrivateFile`, `customCoordinates`, `extensions`, `webhookUrl`, `overwriteFile`, `overwriteAITags`, `overwriteTags`, `overwriteCustomMetadata`, `customMetadata`, and `transformation`, and `checks` parameters. |
| onSuccess               | Function callback                                          | Optional. Called if the upload is successful. The first and only argument is the response JSON from the upload API. The request-id, response headers, and HTTP status code are also accessible using the $ResponseMetadata key that is exposed from the [javascript sdk](https://github.com/imagekit-developer/imagekit-javascript#access-request-id-other-response-headers-and-http-status-code)                       |
| onError                 | Function callback                                          | Optional. Called if upload results in an error. The first and only argument is the error received from the upload API                                                                                                                                                                                                                                                                                                   |
| urlEndpoint             | String                                                     | Optional. If not specified, the URL-endpoint specified in the parent `ImageKitProvider` component is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/                                                                                                                                                                                                                                                      |
| publicKey               | String                                                     | Optional. If not specified, the `publicKey` specified in the parent `ImageKitProvider` component is used.                                                                                                                                                                                                                                                                                                                      |
| authenticator           | ()=>Promise<{signature:string,token:string,expiry:number}> | Optional. If not specified, the `authenticator` specified in the parent `ImageKitProvider` component is used.                                                                                                                                                                                                                                                                                                                  |
| checks | String | Optional. Run server-side checks before uploading files. For example, `"file.size" < "1mb"` will check if the file size is less than 1 MB. Check [Upload API docs](https://imagekit.io/docs/api-reference/upload-file/upload-file#upload-api-checks) to learn more. Notice the quotes around `file.size` and `1mb`; otherwise, you will get an error `Your request contains invalid syntax for the checks parameter.` |


> Make sure that you have specified `authenticator` and `publicKey` in `IKUpload` or in the parent `ImageKitProvider` component as a prop. The authenticator expects an asynchronous function that resolves with an object containing the necessary security parameters i.e `signature`, `token`, and `expire`.

#### Abort upload

ref can be passed to obtain access to the IKUpload component's instance. Currently, only 1 `abort` method is supported to be called on the ref. Calling the `abort` method will abort the upload if any is in progress.

Sample Usage

```js
const onUploadStart = (evt) => {
  console.log('Started', evt);
};

const onUploadProgress = (evt) => {
  console.log('Progress: ', evt);
};

const onError = (err) => {
  console.log('Error');
  console.log(err);
};

const onSuccess = (res) => {
  console.log('Success');
  console.log(res);
};

<ImageKitProvider
  publicKey="your_public_api_key"
  urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
  authenticator={()=>Promise} 
  // This promise  resolves with an object containing the necessary security parameters i.e `signature`, `token`, and `expire`.
>
  <IKUpload
    onError={onError}
    onSuccess={onSuccess}
    onUploadStart={onUploadStart}
    onUploadProgress={onUploadProgress}
    transformation={{
      pre: 'l-text,i-Imagekit,fs-50,l-end', 
      post: [
        {
          'type': 'transformation', 
          'value': 'w-100'
        }
      ]
    }}
  />
</ImageKitProvider>;
```

Custom Button Example, using ref

```js
const reftest = useRef(null);

const onError = (err) => {
  console.log('Error');
  console.log(err);
};

const onSuccess = (res) => {
  console.log('Success');
  console.log(res);
};

<ImageKitProvider
  publicKey="your_public_api_key"
  urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
  authenticator={()=>Promise} 
  // This promise  resolves with an object containing the necessary security parameters i.e `signature`, `token`, and `expire`.
>
  <IKUpload
    onError={onError}
    onSuccess={onSuccess}
    ref={reftest}
    style={{display: 'none'}} // hide default button
    transformation={{
      pre: 'l-text,i-Imagekit,fs-50,l-end', 
      post: [
        {
          'type': 'transformation', 
          'value': 'w-100'
        }
    ]
    }}
  />
  <h1>Custom Upload Button</h1>
  {reftest && <button className='custom-button-style' onClick={() => reftest.current.click()}>Upload</button>}
</ImageKitProvider>;
```

## ImageKitClient

Accessing the underlying [ImageKit javascript SDK](https://github.com/imagekit-developer/imagekit-javascript) is possible using the `ImageKitClient` import. For example:

```js
import { ImageKitClient } from "imagekitio-next"
// Generate image URL
var imagekit = new ImageKitClient({
    publicKey: "your_public_api_key",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
});
//https://ik.imagekit.io/your_imagekit_id/endpoint/tr:h-300,w-400/default-image.jpg
var imageURL = imagekit.url({
    path: "/default-image.jpg",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
    transformation: [{
        "height": "300",
        "width": "400"
    }]
});
```

## ImageKitContext

To access options such as `urlEndpoint`, `publicKey`, `ikClient` or `authenticator` in child elements defined within `ImageKitProvider` you can use `ImageKitContext`. For example:

```js
import { ImageKitContext } from "imagekitio-next"

... 
const { urlEndpoint, ikClient, authenticator } = useContext(ImageKitContext);

```

## Support

For any feedback or to report any issues or general implementation support, please reach out to [support@imagekit.io](mailto:support@imagekit.io)

## Links
* [Documentation](https://imagekit.io/docs)
* [Main website](https://imagekit.io)

## License
Released under the MIT license.
