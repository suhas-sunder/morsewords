# DigitalOcean Droplet deployment

MorseWords keeps its existing React Router SSR application in a Node/Express container. Caddy is the public reverse proxy: it terminates HTTPS, performs normal HTTP-to-HTTPS redirects, and forwards every request unchanged. The application remains responsible for SSR, loaders, actions, redirects, 404s, sitemap, `llms.txt`, cookies, and assets.

GitHub Actions builds images and publishes them to GHCR. The Droplet only pulls a published image and restarts Compose; do not build the application on the Droplet.

## Prerequisites

Use a supported Ubuntu LTS Droplet. A 2 GB Droplet is a practical minimum; select more memory for traffic and operational headroom. Build in GitHub Actions because a small Droplet should not run the JavaScript production build.

Create a non-root deployment user, use SSH keys, and disable password SSH only after confirming key-based access in another session. Install Docker Engine and the Compose plugin from the official Docker repository, then enable Docker:

```bash
sudo systemctl enable --now docker
sudo usermod -aG docker deploy
```

Log out and back in after changing group membership. Configure UFW or a DigitalOcean Cloud Firewall for TCP 22 (preferably from your address), 80, and 443. Do not expose port 3000.

## GitHub and GHCR

`.github/workflows/build-production-image.yml` runs on pushes to `main` and manually. It publishes `ghcr.io/suhas-sunder/morsewords:latest` and `ghcr.io/suhas-sunder/morsewords:<full-git-sha>`.

Allow Actions package write permission in the GitHub repository. In GHCR, make the package public or grant the deployment identity package-read access. For a private package, authenticate on the Droplet without putting credentials in `.env.production`:

```bash
docker login ghcr.io
```

If production already uses book-content overrides, add the corresponding repository Actions variables `VITE_MORSE_BOOK_CONTENT_BASE_URL` and/or `VITE_ENABLE_LOCAL_BOOK_CONTENT_ROUTE`. They are build-time configuration, not runtime secrets.

## First deployment

Clone or copy the deployment configuration to a directory owned by the deployment user. Keep the production environment file only on the Droplet:

```bash
git clone https://github.com/suhas-sunder/morsewords.git
cd morsewords
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
chmod +x scripts/deploy-digitalocean.sh scripts/rollback-digitalocean.sh
./scripts/deploy-digitalocean.sh
```

Set `DOMAIN`, `APEX_DOMAIN`, `IMAGE_NAME`, `PORT`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` in `.env.production`. The current production policy redirects the apex domain to `www`, so use the `www` host for `DOMAIN` and the bare host for `APEX_DOMAIN`. `IMAGE_TAG=latest` is appropriate for the first deploy. `MORSEWORDS_INTERNAL_ORIGIN` stays optional and should be set only when current production behavior requires it.

Create DNS `A`/`AAAA` records for the exact domain before starting Caddy. Verify DNS and automatic HTTPS:

```bash
dig +short www.example.com
curl -I http://www.example.com
curl -I https://www.example.com
```

Back up Caddy certificate data before infrastructure changes:

```bash
docker run --rm -v morsewords_caddy_data:/data -v "$PWD":/backup alpine tar czf /backup/caddy-data-backup.tgz -C /data .
```

To restore, stop the stack and extract that archive into the same named volume using an equivalent temporary Alpine container. Keep Netlify available while the Droplet is verified. Switch DNS only after checks pass; to roll DNS back, restore the prior Netlify DNS target and allow propagation.

## Deploy, rollback, and operations

Deploy an immutable image by full SHA:

```bash
./scripts/deploy-digitalocean.sh <full-git-sha>
```

Deploy the current latest image only when deliberate:

```bash
./scripts/deploy-digitalocean.sh
```

The script waits for health, records the last successful tag locally, shows status, prints useful logs on failure, and retains tagged images. Roll back without rebuilding or resetting Git:

```bash
./scripts/rollback-digitalocean.sh <known-good-full-git-sha>
```

Useful commands:

```bash
docker compose --env-file .env.production -f compose.production.yml ps
docker compose --env-file .env.production -f compose.production.yml logs -f app
docker compose --env-file .env.production -f compose.production.yml logs -f caddy
docker compose --env-file .env.production -f compose.production.yml restart
docker inspect --format '{{.State.Health.Status}}' "$(docker compose --env-file .env.production -f compose.production.yml ps -q app)"
```

Compose recovers after a Droplet reboot because Docker is enabled at boot and both services use `restart: unless-stopped`. Apply Ubuntu and Docker updates on a maintenance schedule. The deployment script prunes only dangling images older than seven days; inspect `docker image ls` before manual cleanup.

## Behavior and network policy

The Node port is private to Compose. Caddy is the only public service and preserves Host and forwarding headers. The app trusts the single Caddy hop so SSR reconstructs the original HTTPS URL. No proxy cache, SPA fallback, response transformation, DNS automation, or SSH deployment is configured; this deliberately preserves application routes and responses.
