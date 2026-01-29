import * as React from "react";

type SvgIconProps = Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> & {
  /** Pixel size for both width + height */
  size?: number | string;
  /** Accessible title (recommended). Also helpful for indexing when SVG is inlined in HTML. */
  title?: string;
  /** Optional longer description for screen readers */
  desc?: string;
};

/**
 * Shared SVG wrapper that:
 * - Lets you control size via `size`
 * - Uses `currentColor` by default so CSS `color` controls fill
 * - Adds <title>/<desc> and aria-labelledby for accessibility (and better inline semantics)
 */
function SvgIconBase({
  size = 24,
  title,
  desc,
  children,
  fill,
  ...rest
}: SvgIconProps & { children: React.ReactNode }) {
  const titleId = React.useId();
  const descId = React.useId();
  const labelledBy =
    title && desc ? `${titleId} ${descId}` : title ? titleId : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      focusable="false"
      role="img"
      aria-hidden={title ? undefined : true}
      aria-labelledby={labelledBy}
      xmlns="http://www.w3.org/2000/svg"
      fill={fill ?? "currentColor"}
      {...rest}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {desc ? <desc id={descId}>{desc}</desc> : null}
      {children}
    </svg>
  );
}

export const LightBulbIcon = React.memo(function LightBulbIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Light bulb" {...props}>
      <path d="M7 20h4c0 1.1-.9 2-2 2s-2-.9-2-2m-2-1h8v-2H5zm11.5-9.5c0 3.82-2.66 5.86-3.77 6.5H5.27c-1.11-.64-3.77-2.68-3.77-6.5C1.5 5.36 4.86 2 9 2s7.5 3.36 7.5 7.5m4.87-2.13L20 8l1.37.63L22 10l.63-1.37L24 8l-1.37-.63L22 6zM19 6l.94-2.06L22 3l-2.06-.94L19 0l-.94 2.06L16 3l2.06.94z" />
    </SvgIconBase>
  );
});

export const SoundIcon = React.memo(function SoundIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Sound" {...props}>
      <path d="M14 9c0-2.04 1.24-3.79 3-4.57V4c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h9c1.1 0 2-.9 2-2v-2.42c-1.76-.78-3-2.53-3-4.58m-4 5H6v-2h4zm3-3H6V9h7zm0-3H6V6h7z" />
      <path d="M20 6.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V3h2V1h-4z" />
    </SvgIconBase>
  );
});

export const VibrateIcon = React.memo(function VibrateIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Vibrate" {...props}>
      <path d="M3 7h2v7H3zm-3 3h2v7H0zm22-3h2v7h-2zm-3 3h2v7h-2zm-3-7.99L8 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-1.99-2-1.99M16 17H8V7h8z" />
    </SvgIconBase>
  );
});

export const LoopIcon = React.memo(function LoopIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Loop" {...props}>
      <path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53L13.51 12l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37" />
    </SvgIconBase>
  );
});

export const SaveIcon = React.memo(function SaveIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Save" {...props}>
      <path d="M21 12.4V7l-4-4H3v18h9.4zM15 15c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3M6 6h9v4H6zm13.99 10.25 1.77 1.77L16.77 23H15v-1.77zm3.62-.09-1.2 1.2-1.77-1.77 1.2-1.2z" />
    </SvgIconBase>
  );
});

export const CopyIcon = React.memo(function CopyIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Copy" {...props}>
      <path d="M16 1H2v16h2V3h12zm5 4H6v18h15zm-2 16H8V7h11z" />
    </SvgIconBase>
  );
});

export const PauseIcon = React.memo(function PauseIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Pause" {...props}>
      <path d="M9 16h2V8H9zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m1-4h2V8h-2z" />
    </SvgIconBase>
  );
});

export const PlayIcon = React.memo(function PlayIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Play" {...props}>
      <path d="m10 16.5 6-4.5-6-4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8" />
    </SvgIconBase>
  );
});

export const StopIcon = React.memo(function StopIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Stop" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m4 14H8V8h8z" />
    </SvgIconBase>
  );
});

export const ShareIcon = React.memo(function ShareIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Share" {...props}>
      <path d="M5.01 1v22H19V1zM17 19H7V5h10zm-4.2-5.76v1.75L16 12l-3.2-2.98v1.7c-3.11.43-4.35 2.56-4.8 4.7 1.11-1.5 2.58-2.18 4.8-2.18" />
    </SvgIconBase>
  );
});

/** Optional convenience map */
export const Icons = {
  LightBulbIcon,
  SoundIcon,
  VibrateIcon,
  LoopIcon,
  SaveIcon,
  CopyIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  ShareIcon,
} as const;
