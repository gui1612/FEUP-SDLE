FROM eclipse-temurin:21-jdk-jammy as build

WORKDIR /app

COPY gradle/ ./gradle
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY src/ ./src
RUN ./gradlew installDist --no-daemon

FROM eclipse-temurin:21-jre-jammy as runner

WORKDIR /app
COPY --from=build /app/build/install/db .

ENTRYPOINT ["/app/bin/db"]