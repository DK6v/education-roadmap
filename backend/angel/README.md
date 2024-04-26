## Running the application
- Set the ```START_SCRIPT``` variable to ```start``` or ```start:dev``` in the ```.env``` file.
- Run the ```docker compose up --build``` command.

## Running the tests
- Set the ```START_SCRIPT``` variable to ```test``` or ```test:e2e``` in the ```.env``` file.
- Run the ```docker compose up --build``` command.
- The API of the application is available on http://localhost:3000 address.

## Create the node_modules
- Start the application or test environment.
- Run the ```docker cp angel.server:/app/node_modules .``` command.
