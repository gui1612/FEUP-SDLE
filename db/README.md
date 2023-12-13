# Database Service

Handles database-related components responsible for storing and retrieving crucial data. These module was developed with strong inspiration in DynamoDB's design.
It features high scalability, availabilty and durability, through the use of techniques such as vector clocks, consistent hashing and hinted handoff as well as sloppy quorums.

## Setup and Running

### Docker Compose

1. Run `docker compose up`

### Gradle


1. Run the following commands:

    ```bash
    gradlew install dist
    ./build/install/db/bin/db init-config
    ```

    This will create a `config.yml` file to edit the cluster config.

2. Edit the config.yml file with the desired cluster configuration.

3. Start the database instance using:

    ```bash
    ./build/install/db/bin/db start <instance_name>
    ```
    Replace `<instance_name>` with the instance name from the config file.