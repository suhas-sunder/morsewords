import type { ReactNode } from "react";
import {
  HERO_EYEBROW_LINE_CLASS,
  HERO_EYEBROW_ROW_CLASS,
  HERO_EYEBROW_TEXT_CLASS,
} from "~/client/components/shared/heroStyles";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionEyebrow({
  children,
  className,
}: SectionEyebrowProps) {
  const rowClassName = className
    ? `${HERO_EYEBROW_ROW_CLASS} ${className}`
    : HERO_EYEBROW_ROW_CLASS;

  return (
    <div className={rowClassName}>
      <span className={HERO_EYEBROW_LINE_CLASS} />
      <span className={HERO_EYEBROW_TEXT_CLASS}>{children}</span>
    </div>
  );
}
