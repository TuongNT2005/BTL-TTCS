FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app

COPY shop/pom.xml .
RUN mvn dependency:go-offline

COPY shop/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

COPY ./uploads ./uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]