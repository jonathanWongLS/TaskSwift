FROM openjdk:17
VOLUME /tmp
EXPOSE 80
ARG JAR_FILE=target/taskswift-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]