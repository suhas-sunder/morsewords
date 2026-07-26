#!/usr/bin/env bash
set -Eeuo pipefail

readonly script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly repo_dir="$(cd -- "$script_dir/.." && pwd)"
readonly compose_file="$repo_dir/compose.production.yml"
readonly env_file="${MORSEWORDS_DEPLOY_ENV_FILE:-$repo_dir/.env.production}"
readonly state_file="${MORSEWORDS_DEPLOY_STATE_FILE:-$repo_dir/.digitalocean-last-image-tag}"
readonly image_tag="${1:-latest}"

if [[ $# -gt 1 ]]; then
  echo "Usage: $(basename "$0") [image-tag]" >&2
  exit 64
fi

if [[ ! -f "$compose_file" ]]; then
  echo "Missing Compose file: $compose_file" >&2
  exit 1
fi
if [[ ! -f "$env_file" ]]; then
  echo "Missing deployment environment file: $env_file" >&2
  exit 1
fi
if [[ ! "$image_tag" =~ ^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$ ]]; then
  echo "Image tag contains unsupported characters." >&2
  exit 64
fi

compose() {
  IMAGE_TAG="$image_tag" docker compose --env-file "$env_file" -f "$compose_file" "$@"
}

show_failure_logs() {
  echo "Deployment failed. Recent service logs:" >&2
  compose logs --tail=150 app caddy >&2 || true
}
trap show_failure_logs ERR

cd "$repo_dir"
compose config --quiet

previous_tag=""
if [[ -f "$state_file" ]]; then
  previous_tag="$(<"$state_file")"
fi

echo "Pulling MorseWords image tag: $image_tag"
compose pull app caddy
echo "Starting the production stack"
compose up -d --remove-orphans

container_id="$(compose ps -q app)"
if [[ -z "$container_id" ]]; then
  echo "The application container was not created." >&2
  exit 1
fi

healthy=false
for _ in {1..30}; do
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"
  if [[ "$health" == "healthy" ]]; then
    healthy=true
    break
  fi
  if [[ "$health" == "exited" || "$health" == "dead" ]]; then
    break
  fi
  sleep 2
done

if [[ "$healthy" != true ]]; then
  echo "Application health check did not pass." >&2
  exit 1
fi

printf '%s\n' "$image_tag" > "$state_file"
echo "Deployment is healthy."
compose ps
if [[ -n "$previous_tag" && "$previous_tag" != "$image_tag" ]]; then
  echo "Previous successful tag retained for rollback: $previous_tag"
fi
# Remove only dangling images older than a week; tagged rollback images remain.
docker image prune -f --filter "until=168h" >/dev/null || true
