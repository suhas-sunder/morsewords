import * as React from "react";

import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";

export default function ToggleChip({
  label,
  active,
  onClick,
  title,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className={toolControlButtonClass({
        active,
        size: "sm",
        rounded: "full",
      })}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
