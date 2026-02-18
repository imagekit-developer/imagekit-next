# Changelog

## 2.1.5

Include `@imagekitio/javascript` in external in Rollup config to prevent bundling it with the package, allowing users to be able to fetch the latest version of the SDK without needing to update the package. This also reduces the bundle size of the package and allows users to manage the SDK version separately.

## 2.1.4

- Added `ref` support to the **Video** component using `forwardRef`, enabling programmatic control of the video element (play, pause, etc.) and access to native video DOM methods. This is particularly useful for implementing custom video controls or handling browser-specific requirements like Safari's autoplay policies.

## 2.1.3

- Fixed missing `ref` prop support in the **Image** component. The component now properly accepts and forwards all Next.js Image props, including `ref`, by using `React.ComponentPropsWithRef<typeof NextImage>` instead of the exported `ImageProps` type.

## 2.1.2

- Bump `@imagekitio/javascript` dependency to `5.1.0`.
- Export `getResponsiveImageAttributes` util function from the package.
- Improved type definitions for the solid color overlay transformations.

## 2.1.1

- `transformationPosition` prop in the **Video** component was not working, this has been fixed.

## 2.1.0

- Added an optional `responsive` prop to the **`Image`** component. Set `responsive` to `false` to disable automatic `srcset` generation and prevent any transformations you haven’t explicitly specified. This is also handy when Restricted Unnamed Transformation is enabled and you want to stop the SDK from applying any extra transformations beyond the ones you specify.

## 2.0.0

- Major v2 upgrade with several breaking changes and wide-ranging improvements.
- See the updated [official documentation](https://imagekit.io/docs/integration/nextjs) before upgrading.

## 1.0.1
- Added Node-version support.  
- Improved lazy-loading behaviour.

## 1.0.0
- Initial stable release.
