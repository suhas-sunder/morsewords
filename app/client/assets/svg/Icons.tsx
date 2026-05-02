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

export const WarningIcon = React.memo(function WarningIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Warning" {...props}>
      <path d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z" />
    </SvgIconBase>
  );
});

export const PrintIcon = React.memo(function PrintIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Print" {...props}>
      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3M16 19H8v-5h8zm3-5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1M18 3H6v4h12z" />
    </SvgIconBase>
  );
});

export const DownloadIcon = React.memo(function DownloadIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Download" {...props}>
      <path d="M5 20h14v-2H5zm14-9h-4V3H9v8H5l7 7z" />
    </SvgIconBase>
  );
});

export const ShuffleIcon = React.memo(function ShuffleIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Shuffle" {...props}>
      <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17zm4.91-4.67 2.04 2.04L4 20.09 5.41 21.5 18.96 7.96 21 10V4.5zM14.83 13.41l-1.41 1.41 4.13 4.13L15.5 21H21v-5.5l-2.04 2.04z" />
    </SvgIconBase>
  );
});

export const RefreshIcon = React.memo(function RefreshIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Refresh" {...props}>
      <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z" />
    </SvgIconBase>
  );
});

export const VisibilityIcon = React.memo(function VisibilityIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Show" {...props}>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5m0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10m0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
    </SvgIconBase>
  );
});

export const VisibilityOffIcon = React.memo(function VisibilityOffIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Hide" {...props}>
      <path d="M2.81 2.81 1.39 4.22l3.05 3.05A11.7 11.7 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l3.4 3.4 1.41-1.41zm6.3 6.3 1.55 1.55A3 3 0 0 0 13.34 13l1.55 1.55A5 5 0 0 1 9.1 9.1m2.82-2.1L15 10.08V9h2v2h-1.08l2.8 2.8A11.9 11.9 0 0 0 23 12c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.24-3.98.69l2.14 2.14c.55-.21 1.14-.33 1.77-.33" />
    </SvgIconBase>
  );
});

export const QrCodeIcon = React.memo(function QrCodeIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="QR code" {...props}>
      <path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm10-2h2v2h-2zm4 0h2v2h-2zm-6 4h2v4h-2zm4 0h4v2h-2v2h-2zm2-2h2v2h-2z" />
    </SvgIconBase>
  );
});

export const CheckCircleIcon = React.memo(function CheckCircleIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Check" {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z" />
    </SvgIconBase>
  );
});

export const CloseIcon = React.memo(function CloseIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Close" {...props}>
      <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z" />
    </SvgIconBase>
  );
});

export const SearchIcon = React.memo(function SearchIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Search" {...props}>
      <path d="M9.5 3a6.5 6.5 0 0 1 5.16 10.45l5.44 5.45-1.41 1.41-5.45-5.44A6.5 6.5 0 1 1 9.5 3m0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9" />
    </SvgIconBase>
  );
});

export const ListIcon = React.memo(function ListIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="List" {...props}>
      <path d="M4 10.5c.83 0 1.5-.67 1.5-1.5S4.83 7.5 4 7.5 2.5 8.17 2.5 9 3.17 10.5 4 10.5m0 6c.83 0 1.5-.67 1.5-1.5S4.83 13.5 4 13.5 2.5 14.17 2.5 15 3.17 16.5 4 16.5M4 4.5c.83 0 1.5-.67 1.5-1.5S4.83 1.5 4 1.5 2.5 2.17 2.5 3 3.17 4.5 4 4.5M8 4h14V2H8zm0 6h14V8H8zm0 6h14v-2H8zm0 6h14v-2H8z" />
    </SvgIconBase>
  );
});

export const TuneIcon = React.memo(function TuneIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Settings" {...props}>
      <path d="M3 17v2h6v-2zm0-12v2h10V5zm10 16v-2h8v-2h-8v-2h-2v6zm-6-8v2h2V9H7v2H3v2zm4 0h10v-2H11zm4-4h2V7h4V5h-4V3h-2z" />
    </SvgIconBase>
  );
});

export const SchoolIcon = React.memo(function SchoolIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="School" {...props}>
      <path d="M12 3 1 9l4 2.18v6L12 21l7-3.82v-6L21 10v7h2V9zm6.82 6L12 12.72 5.18 9 12 5.28zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73z" />
    </SvgIconBase>
  );
});

export const KeyboardIcon = React.memo(function KeyboardIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Keyboard" {...props}>
      <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2M8 8h2v2H8zm0 3h2v2H8zm-1 2H5v-2h2zm0-3H5V8h2zm9 7H8v-2h8zm0-4h-2v-2h2zm0-3h-2V8h2zm3 3h-2v-2h2zm0-3h-2V8h2zm-6 3h-2v-2h2zm0-3h-2V8h2z" />
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
  WarningIcon,
  PrintIcon,
  DownloadIcon,
  ShuffleIcon,
  RefreshIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  QrCodeIcon,
  CheckCircleIcon,
  CloseIcon,
  SearchIcon,
  ListIcon,
  TuneIcon,
  SchoolIcon,
  KeyboardIcon,
} as const;
