# React 19 Migration Guide

## Current Status

This library currently targets React 18 (as indicated by `@types/react: ^18.3.3` in devDependencies).

## About `forwardRef` in PR #20

The Video component now uses `forwardRef` to forward refs to the underlying HTML `<video>` element. This is the **correct and recommended approach for React 18**.

### Why forwardRef is needed in React 18

In React 18 and earlier, function components cannot directly receive refs. When you try to pass a ref to a function component, React ignores it. To enable ref forwarding, you must wrap the component with `React.forwardRef`.

**Example of the problem without forwardRef:**
```tsx
// This WON'T work in React 18
const Video = (props) => {
  return <video {...props} />;
};

// ref will be undefined
const MyComponent = () => {
  const videoRef = useRef(null);
  return <Video ref={videoRef} />; // ref is ignored!
};
```

**Solution with forwardRef (current implementation):**
```tsx
// This WORKS in React 18
const Video = forwardRef((props, ref) => {
  return <video ref={ref} {...props} />;
});

// ref works correctly
const MyComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  return <Video ref={videoRef} />; // ref is forwarded!
};
```

## React 19 Changes

React 19 introduces a breaking change where `forwardRef` is deprecated in favor of passing `ref` as a regular prop.

### React 19 New Pattern (Future)

```tsx
// React 19+ allows this directly
type VideoProps = React.ComponentPropsWithRef<"video">;
const Video = ({ ref, ...props }: VideoProps) => {
  return <video ref={ref} {...props} />;
};

// Or simply use JSX.IntrinsicElements
const Video = (props: JSX.IntrinsicElements["video"]) => {
  return <video {...props} />;
};
```

## Migration Strategy

When this library is ready to support React 19:

### Option 1: Support React 19 Only
1. Update `peerDependencies` to require React 19+
2. Remove `forwardRef` wrappers
3. Update component signatures to accept ref as a prop
4. Update TypeScript types

### Option 2: Support Both React 18 and 19 (Recommended)
1. Keep `forwardRef` (it still works in React 19, though deprecated)
2. Update `peerDependencies` to allow both versions: `"react": "^18.0.0 || ^19.0.0"`
3. Monitor React 19 adoption and remove `forwardRef` in a future major version

### Codemod for Migration

React provides an official codemod to automate the migration:
```bash
npx codemod@latest react/19/remove-forward-ref
```

## Recommendation

**For now:** The current implementation with `forwardRef` is correct and should be kept.

**For the future:** When React 19 support is added:
- Either keep `forwardRef` for backward compatibility (it still works in React 19)
- Or create a breaking change (v3.0.0) that drops React 18 support and removes `forwardRef`

## References

- [React 19 forwardRef Documentation](https://react.dev/reference/react/forwardRef)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- PR #20: https://github.com/imagekit-developer/imagekit-next/pull/20
- PR #17: https://github.com/imagekit-developer/imagekit-next/pull/17 (Image component type improvements)
