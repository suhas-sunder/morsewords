import * as React from "react";

import { CheckCircleIcon, CopyIcon } from "~/client/assets/svg/Icons";
import {
  copyTextToClipboard as copyTextToClipboardResult,
  type ActionOutputResult,
} from "~/client/components/shared/actionOutputUtils";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";

type ToolActionSize = "sm" | "md" | "lg";
type ToolActionTone = "light" | "dark" | "darkPanel";
type ToolActionRounded = "lg" | "xl" | "full";

type ActionButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "type"
> & {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  full?: boolean;
  leadingIcon?: React.ReactNode;
  rounded?: ToolActionRounded;
  size?: ToolActionSize;
  tone?: ToolActionTone;
  trailingIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  unstyled?: boolean;
};

type ActionLinkButtonProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "className"
> & {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  full?: boolean;
  leadingIcon?: React.ReactNode;
  rounded?: ToolActionRounded;
  size?: ToolActionSize;
  tone?: ToolActionTone;
  trailingIcon?: React.ReactNode;
  unstyled?: boolean;
};

type CopyActionButtonProps = Omit<
  ActionButtonProps,
  "children" | "leadingIcon" | "onClick" | "onCopy" | "trailingIcon"
> & {
  copiedLabel?: string | null;
  iconSize?: number;
  label: string;
  onCopiedChange?: (copied: boolean) => void;
  onCopy?: (
    value: string,
  ) => Promise<ActionOutputResult | boolean | void> | ActionOutputResult | boolean | void;
  resetDelayMs?: number;
  value: string;
};

export function ActionButton({
  active,
  children,
  className,
  disabled,
  full,
  leadingIcon,
  rounded,
  size = "md",
  tone,
  trailingIcon,
  type = "button",
  unstyled = false,
  ...buttonProps
}: ActionButtonProps) {
  const resolvedClassName = unstyled
    ? className
    : joinClassNames(
        toolControlButtonClass({
          active,
          disabled,
          full,
          rounded,
          size,
          tone,
        }),
        className,
      );

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled}
      className={resolvedClassName}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}

export function ActionLinkButton({
  active,
  children,
  className,
  disabled = false,
  full,
  leadingIcon,
  onClick,
  rounded,
  size = "md",
  tabIndex,
  tone,
  trailingIcon,
  unstyled = false,
  ...anchorProps
}: ActionLinkButtonProps) {
  const resolvedClassName = unstyled
    ? className
    : joinClassNames(
        toolControlButtonClass({
          active,
          disabled,
          full,
          rounded,
          size,
          tone,
        }),
        className,
      );

  return (
    <a
      {...anchorProps}
      aria-disabled={disabled ? true : undefined}
      className={resolvedClassName}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      tabIndex={disabled ? -1 : tabIndex}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </a>
  );
}

export function CopyActionButton({
  copiedLabel = "Copied",
  disabled,
  iconSize = 16,
  label,
  onCopiedChange,
  onCopy,
  resetDelayMs = 900,
  value,
  ...buttonProps
}: CopyActionButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const setCopiedState = React.useCallback(
    (nextCopied: boolean) => {
      setCopied(nextCopied);
      onCopiedChange?.(nextCopied);
    },
    [onCopiedChange],
  );

  const visibleLabel =
    copied && copiedLabel !== null ? copiedLabel : label;

  return (
    <ActionButton
      {...buttonProps}
      disabled={disabled}
      onClick={async () => {
        if (disabled) return;

        try {
          const copyResult = onCopy
            ? await onCopy(value)
            : await copyTextToClipboard(value);
          const didCopy = isActionOutputResult(copyResult)
            ? copyResult.ok
            : copyResult !== false;

          if (!didCopy) {
            setCopiedState(false);
            return;
          }
          setCopiedState(true);
          window.setTimeout(() => setCopiedState(false), resetDelayMs);
        } catch {
          setCopiedState(false);
        }
      }}
      leadingIcon={
        copied ? (
          <CheckCircleIcon size={iconSize} title={undefined} aria-hidden="true" />
        ) : (
          <CopyIcon size={iconSize} title={undefined} aria-hidden="true" />
        )
      }
    >
      <span aria-live="polite">{visibleLabel}</span>
    </ActionButton>
  );
}

export function ActionRow({
  children,
  className,
  ...rowProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rowProps} className={joinClassNames("flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}

export async function copyTextToClipboard(value: string) {
  const result = await copyTextToClipboardResult(value);
  return result.ok;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
) {
  return classNames.filter(Boolean).join(" ");
}

function isActionOutputResult(value: unknown): value is ActionOutputResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    typeof (value as ActionOutputResult).ok === "boolean"
  );
}
