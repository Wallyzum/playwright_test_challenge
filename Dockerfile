# Playwright base image includes all browser binaries + system deps pre-installed
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Copy manifests first to exploit Docker layer caching.
# npm ci layer is only invalidated when package.json or lock file changes.
COPY package.json package-lock.json* ./
RUN npm ci

# Copy project source
COPY . .

# Ensure browsers are installed for the exact version in package.json
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test", "--reporter=list,html"]
