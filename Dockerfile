# --------------> The base image.
FROM node:18 as base
ARG GITHUB_TOKEN
WORKDIR /usr/src/app
COPY package.json package.json
COPY package-lock.json package-lock.json

# --------------> The test and lint image
FROM base as test
ARG GITHUB_TOKEN
RUN npm pkg set scripts.prepare=" " && \
  echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" > .npmrc && \
  npm ci && \
  rm -f .npmrc
COPY . .
RUN npm run test && npm run lint

# --------------> The build image
FROM base as build
ARG GITHUB_TOKEN
# WORKDIR /usr/src/app
# COPY package*.json ./
# Disable husky and run npm install with dev dependencies so build transpiling
# will work
RUN npm pkg set scripts.prepare=" " && \
  echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" > .npmrc && \
  npm ci && \
  rm -f .npmrc
COPY . ./
# Build then re-run npm install with only production dependencies so only the required
# modules are copied to the production container
RUN npm run build && \
  npm pkg set scripts.prepare=" " && \
  echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" > .npmrc && \
  npm ci --production --omit=dev && \
  rm -f .npmrc

# --------------> The production image
# Pick up the latest version of our image
FROM ghcr.io/the-everyone-project/docker-ba-node:v2.0.0

# Use this if you want to test on a mac
# FROM gcr.io/distroless/nodejs:18 as production

ARG BUILD_DATE
ARG APP_VERSION
ARG GIT_HASH
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.version=${APP_VERSION}
LABEL org.opencontainers.image.revision=${GIT_HASH}
LABEL org.opencontainers.image.vendor='The Everyone Project'

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=1000:1000 --from=build /usr/src/app/node_modules node_modules/
COPY --chown=1000:1000 --from=build /usr/src/app/build ./
COPY --chown=1000:1000 --from=build /usr/src/app/package.json ../package.json
USER 1000
EXPOSE 4000
CMD ["index.js"]

# -----> Test using:
# docker build --no-cache --build-arg GITHUB_TOKEN=<token> -t <container_name> --target test .

# -----> Build using (the non token build args are optional and only needed when building production builds):
# docker build \
#   --no-cache=true \
#   --build-arg GITHUB_TOKEN=1234
#   --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
#   --build-arg APP_VERSION=${{ github.ref_name }} \
#   --build-arg GIT_HASH=$(git rev-parse HEAD) \
#   -t <container_name>:<container_tag> .

# -----> Run using: docker run --env-file .env -p 4000:4000 app-name
# -----> This can also be run with a specific port using:
# -----> docker run --rm -p 4000:4000/tcp --env-file .env app-name