// Coordination only: each engine continues to own synthesis and its resources.
let active: { owner: object; stop: () => void } | null = null;
export function claimPlayback(owner: object, stop: () => void) {
  if (active?.owner === owner) return;
  stopOwnedPlayback();
  active = { owner, stop };
}
export function releasePlayback(owner: object) {
  if (active?.owner === owner) active = null;
}
export function stopOwnedPlayback() {
  const previous = active;
  active = null;
  previous?.stop();
}
