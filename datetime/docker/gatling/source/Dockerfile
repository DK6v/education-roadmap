ARG VERSION
ARG TIMEZONE="Europe/Moscow"

# Stage: downloas source files
# -------------------------------------
FROM alpine/git AS source

WORKDIR /gatling

# Download ByPass/ByeDPI proxy source files
RUN git clone \
--shallow-submodules \
--recurse-submodules \
--depth 1 \
https://github.com/gatling/gatling-maven-plugin-demo-java.git .

# Stage: install
# -------------------------------------
FROM openjdk:24 AS install

# Set timezone
# ARG TIMEZONE
# RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && echo ${TIMEZONE} > /etc/timezone

WORKDIR /gatling
COPY --from=source /gatling /gatling

# Stage: squash
# -------------------------------------
FROM scratch
COPY --from=install / /

WORKDIR /gatling
    