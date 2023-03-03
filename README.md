# Login Backend

This project is a simple login backend that allows users to create an account and then log in. The project uses 4 view models, and there are 4 REST routes that the application provides.

## Requirements

The application has the following requirements:

    There should be 4 REST routes.
    The user table should contain a username and password.
    The password should be encrypted when saved using bcrypt.
    The / route should redirect to the /login route.
    The /login route should check if the user exists and render the fail.ejs view if the user does not exist, and render the start.ejs view if the user exists.
    The password should be compared using bcrypt.
    A JWT token should be created and saved in a string and logged.
    The /login route should render the login.ejs view.
    The /register route should register the user and save the password encrypted with bcrypt. After the user is registered, the user should be redirected to the /login route.
    The /register route should render the register.ejs file.

## Getting Started

To run the application, follow these steps:

- Clone the repository.
- Install the required dependencies using npm install.
- Create a .env file and add the following environment variables:

```bash
PORT=8080
MONGODB_PORT=27017
HOST=localhost
JWT_SECRET=<random_hex_secret>
```
Start the application using npm start.
Open your browser and go to http://localhost:8080/ to access the login page.

## Dependencies

The project uses the following dependencies:

- bcrypt: Used for password hashing and comparison.
- cookie-parser: Used for parsing cookies.
- dotenv: Used for loading environment variables from the .env file.
- ejs: Used for rendering views.
- express: Used for building the REST API.
- jsonwebtoken: Used for creating and verifying JWT tokens.
- mongoose: Used for database operations.

## Code Structure

The code is structured as follows:

- db/user_model.js: Defines the user schema and model for the MongoDB database.
- views/: Contains the EJS view files for the application.
- server.js: Defines the REST routes and starts the Express server.
- script.js: Defines DOM manipulation functions and events

## License

This project is licensed under the MIT License. See the LICENSE file for details.