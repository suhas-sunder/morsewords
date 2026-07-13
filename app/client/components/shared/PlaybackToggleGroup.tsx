import {
  LightBulbIcon,
  LoopIcon,
  VolumeIcon,
  VolumeOffIcon,
} from "~/client/assets/svg/Icons";
import TogglePill from "~/client/components/shared/ui/TogglePill";

export default function PlaybackToggleGroup({
  className = "",
  flash,
  repeat,
  rounded = "full",
  size = "sm",
  sound,
  trailing,
}: {
  className?: string;
  flash: {
    checked: boolean;
    describedBy?: string;
    disabled?: boolean;
    onChange: (value: boolean) => void;
  };
  repeat: { checked: boolean; onChange: (value: boolean) => void };
  rounded?: "lg" | "xl" | "full";
  size?: "sm" | "md" | "lg";
  sound: { checked: boolean; onChange: (value: boolean) => void };
  trailing?: React.ReactNode;
}) {
  return (
    <div className={["flex flex-wrap items-center gap-2", className].filter(Boolean).join(" ")}>
      <TogglePill
        label="Sound"
        checked={sound.checked}
        onChange={sound.onChange}
        rounded={rounded}
        size={size}
        icon={
          sound.checked ? (
            <VolumeIcon size={16} title={undefined} aria-hidden="true" />
          ) : (
            <VolumeOffIcon size={16} title={undefined} aria-hidden="true" />
          )
        }
      />
      <TogglePill
        label="Repeat"
        checked={repeat.checked}
        onChange={repeat.onChange}
        rounded={rounded}
        size={size}
        icon={<LoopIcon size={16} title={undefined} aria-hidden="true" />}
      />
      <TogglePill
        label="Flash Light"
        checked={flash.checked}
        onChange={flash.onChange}
        describedBy={flash.describedBy}
        disabled={flash.disabled}
        rounded={rounded}
        size={size}
        icon={<LightBulbIcon size={16} title={undefined} aria-hidden="true" />}
      />
      {trailing}
    </div>
  );
}
