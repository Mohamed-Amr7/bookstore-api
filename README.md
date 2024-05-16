# Bookstore API

This is a Bookstore API built with Express.js and MongoDB.

## Index

1. [Tech Stack](#tech-stack)
2. [Routes](#routes)
3. [Data Modeling](#data-modeling)
4. [Request Validation](#request-validation)
5. [Error Handling](#error-handling)
6. [Security](#security)
7. [Performance](#performance)
8. [Concurrency Handling](#concurrency-handling)
9. [Installation](#installation)
10. [Deployment](#deployment)

## Tech Stack

- **Backend**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication/Authorization**: Passport.js with JWT (JSON Web Tokens) strategy
- **Logging Middleware**:
    - Morgan for request logging
    - Winston for logging

## Routes

### Auth Route

Handles user authentication and account management.

- `POST /register`: Register a new user.
- `POST /login`: Login a user.
- `POST /logout`: Logout a user.
- `POST /refresh-tokens`: Refresh authentication tokens.
- `POST /forgot-password`: Send forgot password email to a user.
- `POST /reset-password`: Reset a user's password.
- `POST /send-verification-email`: Send a verification email to a user.
- `POST /verify-email`: Verify a user's email address.

## Data Modeling

The application uses the following data models:

1. **User Model**: This model represents a user in the bookstore. Each user has properties like name, email, password,
   role, address, phone, and isEmailVerified. The email is validated to ensure it's in the correct format, and the
   password must contain at least one letter and one number. Before saving a user, the model hashes the password.

2. **Token Model**: This model represents a token in the bookstore. Each token has properties like token, user, type,
   expires, blacklisted. The type of token can be refresh, reset password, or verify email.

3. **Book Model**: This model represents a book in the bookstore. Each book has properties like title, author, price,
   ISBN, description, publication date, page count, genres, stock, and cover image. The genres are validated to ensure
   they belong to the predefined book genres.

4. **Cart Model**: This model represents a user's shopping cart. It's associated with a user and contains an array of
   items. Each item in the cart has a book ID and a quantity. Before saving a cart, the model checks if the books in the
   cart still exist in the database.

5. **Order Model**: This model represents an order placed by a user. It contains an array of items (each with a book ID
   and quantity), status, shipping address, payment method, contact number, and additional details. Before saving an
   order, the model fetches the user's shipping address and contact number if they're not provided.

### Book Route

Handles book management.

- `GET /`: Query books.
- `POST /`: Add a new book (Admin only).
- `GET /:id`: Get a book by ID.
- `PUT /:id`: Update a book (Admin only).
- `DELETE /:id`: Delete a book (Admin only).

### Cart Route

Handles cart management for the logged-in user.

- `GET /`: Get the cart of the logged-in user.
- `POST /`: Add a certain quantity of some books to the cart.
- `PUT /`: Update the quantities of books in the cart.
- `DELETE /`: Remove a certain quantity of some books from the cart.
- `DELETE /clear`: Clear the cart.
- `DELETE /:bookId`: Remove all quantities of a specific book from the cart.

### Order Route

Handles order management.

- `GET /`: Query orders.
- `POST /`: Add a new order from the user's cart.
- `GET /:id`: Get an order by ID.
- `DELETE /:id`: Delete an order.
- `PATCH /:id/status`: Update the status of an order (Order Manager or Admin only).

### Profile Route

Handles user profile management.

- `GET /`: Get the profile of the logged-in user.
- `PUT /`: Update the profile of the logged-in user.
- `DELETE /`: Delete the profile of the logged-in user.
- `POST /password`: Change the password of the logged-in user.

### Users Route

Handles user management (Admin only).

- `GET /:id`: Get a user by ID.
- `PUT /:id`: Update a user.
- `POST /:id/admin`: Grant admin privileges to a user.
- `DELETE /:id/admin`: Revoke admin privileges from a user.
- `POST /:id/order-manager`: Grant order manager privileges to a user.
- `DELETE /:id/order-manager`: Revoke order manager privileges from a user.

## Request Validation

All request validation in this API is performed using the Joi validation library. Joi allows for clear, schema-based
validation of request parameters, ensuring that the data received is exactly as expected.

## Error Handling

Errors in the application are handled using a custom error handler middleware.
This ensures that all errors are caught and processed in a consistent manner.
The application uses the `ApiError` class to create and manage errors throughout the application.

## Security

The application has several security measures in place:

- **Helmet**: This helps secure Express apps by setting various HTTP headers. 
- **XSS-clean**: This is an XSS sanitizer that sanitizes user input coming from POST body, GET queries, and URL
  parameters.
- **Express-mongo-sanitize**: This is a middleware that sanitizes user-supplied data to prevent MongoDB Operator
  Injection.
- **CORS**: Cross-Origin Resource Sharing (CORS) is enabled using the `cors` package. This allows the server to process
  requests from different origins.
- **Rate Limiting**: The application uses rate limiting to limit repeated failed requests to authentication endpoints.
- **Passport-JWT**: The application uses Passport with the JWT strategy for handling authentication.

## Performance

The application uses indexing in MongoDB for improved performance. Specifically, the tokens in the database are indexed.

## Concurrency Handling

The `add order` function in the Order Route handles concurrency by using optimistic locking.

## Installation

To install and run this project locally, follow these steps:

1. Clone this repository.
2. Navigate to the project directory.
3. Install dependencies using npm or yarn:
    ```bash
    npm install
    ```
   or
    ```bash
    yarn install
    ```
4. Set up the environment variables by copying the `.env.example` file and renaming it to `.env`:
    ```bash
    cp .env.example .env
    ```
   Then, fill in the necessary values in the `.env` file.
5. Start the server:
    ```bash
    npm start
    ```
   or
    ```bash
    yarn start
    ```
   Alternatively, you can start the server in development mode with auto-reload using:
    ```bash
    npm run dev
    ```
   or
    ```bash
    yarn dev
    ```
6. The server should now be running at `http://localhost:3000`.

## Deployment

To deploy this application using Docker, follow these steps:

1. Build the Docker image:
    ```bash
    docker build -t your-image-name .
    ```

2. Tag the Docker image with your Docker Hub username and repository name:
    ```bash
    docker tag your-image-name yourusername/your-repository-name
    ```

3. Push the Docker image to Docker Hub:
    ```bash
    docker push yourusername/your-repository-name
    ```

Replace `your-image-name` with the desired name for your Docker image.
Replace `yourusername/your-repository-name` with your Docker Hub username and repository name.

Once the image is pushed to Docker Hub, you can deploy it to your desired environment using Docker.

