# Changelog

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
