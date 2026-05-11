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

export const SparklesIcon = React.memo(function SparklesIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Sparkles" {...props}>
      <path d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 6-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25zm-7.5-5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zm-1.51 3.49L9 15.17l-.99-2.18L5.83 12l2.18-.99L9 8.83l.99 2.18 2.18.99z" />
    </SvgIconBase>
  );
});

export const SmartSettingsIcon = React.memo(function SmartSettingsIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Smart settings" {...props}>
      <path d="M10 13c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3m8.5-2 1.09-2.41L22 5.5l-2.41-1.09L18.5 2l-1.09 2.41L15 5.5l2.41 1.09zm2.78 3.72L20.5 11l-.78 1.72-1.72.78 1.72.78.78 1.72.78-1.72L23 13.5zM16.25 14c0-.12 0-.25-.01-.37l1.94-1.47-2.5-4.33-2.24.94c-.2-.13-.42-.26-.64-.37L12.5 6h-5l-.3 2.41c-.22.11-.43.24-.64.37l-2.24-.95-2.5 4.33 1.94 1.47c-.01.12-.01.25-.01.37s0 .25.01.37l-1.94 1.47 2.5 4.33 2.24-.94c.2.13.42.26.64.37l.3 2.4h5l.3-2.41c.22-.11.43-.23.64-.37l2.24.94 2.5-4.33-1.94-1.47c.01-.11.01-.24.01-.36m-1.42 3.64-1.73-.73c-.56.6-1.3 1.04-2.13 1.23L10.73 20H9.27l-.23-1.86c-.83-.19-1.57-.63-2.13-1.23l-1.73.73-.73-1.27 1.49-1.13q-.18-.585-.18-1.23t.18-1.23l-1.49-1.13.73-1.27 1.73.73c.56-.6 1.3-1.04 2.13-1.23L9.27 8h1.47l.23 1.86c.83.19 1.57.63 2.13 1.23l1.73-.73.73 1.27-1.49 1.13q.18.585.18 1.23t-.18 1.23l1.49 1.13z" />
    </SvgIconBase>
  );
});

export const SignalPathIcon = React.memo(function SignalPathIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Signal path" {...props}>
      <path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2" />
      <path d="m15 9 .94-2.07L18 6l-2.06-.93L15 3l-.92 2.07L12 6l2.08.93zM3.5 11 4 9l2-.5L4 8l-.5-2L3 8l-2 .5L3 9z" />
    </SvgIconBase>
  );
});

export const SunIcon = React.memo(function SunIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Sun" {...props}>
      <path d="m6.76 4.84-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495 1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115 1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6m0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4m-1 4h2v2.95h-2zm-7.45-.96 1.41 1.41 1.79-1.8-1.41-1.41z" />
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

export const TrashIcon = React.memo(function TrashIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Trash" {...props}>
      <path d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z" />
    </SvgIconBase>
  );
});

export const UploadIcon = React.memo(function UploadIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Upload" {...props}>
      <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5z" />
    </SvgIconBase>
  );
});

export const EqualizerIcon = React.memo(function EqualizerIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Equalizer" {...props}>
      <path d="M5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v10c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16V6H5zM4 17c-.55 0-1-.45-1-1v-2h2v2c0 .55-.45 1-1 1m-1-5V8h2v4zM13 2c0-.55-.45-1-1-1s-1 .45-1 1v4H9v10c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.42 2-1.52 2-2.82V6h-2zm-1 15c-.55 0-1-.45-1-1v-2h2v2c0 .55-.45 1-1 1m-1-5V8h2v4zm10-6V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v10c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.42 2-1.52 2-2.82V6zm-1 11c-.55 0-1-.45-1-1v-2h2v2c0 .55-.45 1-1 1m-1-5V8h2v4z" />
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
      <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5z" />
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
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
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
      <path d="M3 17v2h6v-2zM3 5v2h10V5zm10 16v-2h8v-2h-8v-2h-2v6zM7 9v2H3v2h4v2h2V9zm14 4v-2H11v2zm-6-4h2V7h4V5h-4V3h-2z" />
    </SvgIconBase>
  );
});

export const VolumeIcon = React.memo(function VolumeIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Volume" {...props}>
      <path d="M14 8.83v6.34L11.83 13H9v-2h2.83zM16 4l-5 5H7v6h4l5 5z" />
    </SvgIconBase>
  );
});

export const VolumeOffIcon = React.memo(function VolumeOffIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Volume off" {...props}>
      <path d="M4.34 2.93 2.93 4.34 7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06c1.34-.3 2.57-.92 3.61-1.75l2.05 2.05 1.41-1.41zM10 15.17 7.83 13H5v-2h2.83l.88-.88L10 11.41zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71m-7-8-1.88 1.88L12 7.76zm4.5 8c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24" />
    </SvgIconBase>
  );
});

export const HeadphonesIcon = React.memo(function HeadphonesIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Headphones" {...props}>
      <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9M7 15v4H5v-4zm12 4h-2v-4h2z" />
    </SvgIconBase>
  );
});

export const MoonIcon = React.memo(function MoonIcon(props: SvgIconProps) {
  return (
    <SvgIconBase title="Moon" {...props}>
      <path d="M12.34 2.02C6.59 1.82 2 6.42 2 12c0 5.52 4.48 10 10 10 3.71 0 6.93-2.02 8.66-5.02-7.51-.25-12.09-8.43-8.32-14.96" />
    </SvgIconBase>
  );
});

export const ThemeSunIcon = React.memo(function ThemeSunIcon(
  props: SvgIconProps,
) {
  return (
    <SvgIconBase title="Theme sun" {...props}>
      <path d="M11 4V2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1m7.36 3.05 1.41-1.42c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0l-1.41 1.42c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0M22 11h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1m-10 8c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1M5.64 7.05 4.22 5.64c-.39-.39-.39-1.03 0-1.41s1.03-.39 1.41 0l1.41 1.41c.39.39.39 1.03 0 1.41s-1.02.39-1.4 0m11.31 9.9c-.39.39-.39 1.03 0 1.41l1.41 1.41c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.41-1.41c-.38-.39-1.02-.39-1.41 0M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m3.64 6.78 1.41-1.41c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.03 0 1.41.38.39 1.02.39 1.41 0M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6" />
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
  SparklesIcon,
  SmartSettingsIcon,
  SignalPathIcon,
  SunIcon,
  SoundIcon,
  VibrateIcon,
  TrashIcon,
  UploadIcon,
  EqualizerIcon,
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
  VolumeIcon,
  VolumeOffIcon,
  HeadphonesIcon,
  MoonIcon,
  ThemeSunIcon,
  SchoolIcon,
  KeyboardIcon,
} as const;
