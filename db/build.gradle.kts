import com.google.protobuf.gradle.id

plugins {
    id("java")
    id("application")
    id("com.google.protobuf").version("0.9.4")
}

group = "pt.up.fe.sdle2023"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // Dependencies for gRPC
    runtimeOnly("io.grpc:grpc-netty-shaded:1.59.0")
    implementation("io.grpc:grpc-protobuf:1.59.0")
    implementation("io.grpc:grpc-stub:1.59.0")
    compileOnly("org.apache.tomcat:annotations-api:6.0.53") // necessary for Java 9+

    // Dependencies for RocksDB
    implementation("org.rocksdb:rocksdbjni:8.6.7")

    testImplementation(platform("org.junit:junit-bom:5.9.1"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:3.22.3"
    }

    plugins {
        id("grpc") {
            artifact = "io.grpc:protoc-gen-grpc-java:1.59.0"
        }
    }
    generateProtoTasks {
        all().all {
            plugins {
                id("grpc")
            }
        }
    }
}

application {
    mainClass.set("pt.up.fe.sdle2023.db.Main")
}

tasks.test {
    useJUnitPlatform()
}
