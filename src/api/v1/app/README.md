# API App Readme

This is a sample controller and route for an Express app created for testing purposes.

## Getting Started

### Prerequisites

- Node.js installed on your local machine
- An understanding of the basics of Node.js and Express

### Installing

1. Clone the repository
2. Install dependencies by running `npm install`
3. Start the server by running `npm start`
4. Access the app at `http://localhost:3000/api/v1` with the following routes

## Usage

The app has the following endpoints:

- `/test-route-protection`: A protected route to check if the user is authenticated
- `/test-check-authenticated-user`: A route to check the authenticated user
- `/test-pubsub-publish`: A route to publish a message to a Google PubSub topic
- `/test-pubsub-pull-subscription`: A route to receive a message from a Google PubSub pull subscription
- `/test-pubsub-push-subscription`: A route to receive a message from a Google PubSub push subscription
- `/test-pdf-make`: A route to generate a PDF

To use the endpoints, send a request to the respective endpoint using a tool like Postman.

## Controller Functions

The app has the following controller functions:

### `checkRouteProtection`

A function to check if the user is authenticated and the test is completed.

### `checkUserLogged`

A function to check the authenticated user.

### `checkPubSubPublish`

A function to publish a message to a Google PubSub topic.

### `checkPubSubPullSubscription`

A function to receive a message from a Google PubSub pull subscription.

### `checkPubsubPushSubscription`

A function to receive a message from a Google PubSub push subscription.

### `checkPDFMake`

A function to generate a PDF.

## Acknowledgments

This app was created for testing purposes only.
