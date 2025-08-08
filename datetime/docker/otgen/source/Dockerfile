ARG VERSION
ARG TIMEZONE="Europe/Moscow"

# Stage: download source files
# -------------------------------------
FROM alpine/git AS source
ARG VERSION

WORKDIR /otgen

RUN apk update \
 && apk add --upgrade curl

# Download tun2socks proxy source files
RUN git clone \
--shallow-submodules \
--recurse-submodules \
--depth 1 \
--branch ${VERSION} \
https://github.com/open-traffic-generator/otgen.git .    

# Stage: build
# -------------------------------------
FROM golang:alpine AS build
ARG TIMEZONE
    
# Set timezone
RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime \
&& echo ${TIMEZONE} > /etc/timezone

RUN apk add --update --no-cache make git

WORKDIR /otgen
COPY --from=source /otgen .

# Build
RUN make \
&& ln -sfT /otgen/otgen /usr/bin/otgen

# Stage: squash
# -------------------------------------
FROM scratch
COPY --from=build / /

WORKDIR /otgen
