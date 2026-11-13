import * as React from "react";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Focus ownership for existing portal and inline dialogs; no layout/style ownership. */
export function useDialogFocus({ open, dialogRef, triggerRef, initialFocusRef, modal = false, onClose }: {
  open: boolean;
  dialogRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  modal?: boolean;
  onClose: () => void;
}) {
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const focusable = () => [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(element => element.getClientRects().length > 0 && !element.closest("[inert]"));
    const initial = initialFocusRef?.current ?? focusable()[0] ?? dialog;
    initial.focus({ preventScroll: true });
    const outside = modal ? [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && !node.contains(dialog)).map(node => ({ node, inert: node.inert })) : [];
    outside.forEach(({ node }) => { node.inert = true; });

    const keydown = (event: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const nearestDialog = active?.closest('[role="dialog"]');
      // The nested display-settings dialog owns its own Escape key.
      if (nearestDialog && nearestDialog !== dialog) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (modal && event.key === "Tab") {
        const items = focusable();
        const first = items[0];
        const last = items.at(-1);
        if (!first) { event.preventDefault(); dialog.focus(); }
        else if (event.shiftKey && (active === first || !dialog.contains(active))) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (active === last || !dialog.contains(active))) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      outside.forEach(({ node, inert }) => { node.inert = inert; });
      const active = document.activeElement;
      const trigger = triggerRef.current;
      if ((!active || active === document.body || dialog.contains(active)) && trigger?.isConnected && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
    };
  }, [open, dialogRef, triggerRef, initialFocusRef, modal]);
}
