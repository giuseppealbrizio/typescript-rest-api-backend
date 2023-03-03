[![CircleCI](https://dl.circleci.com/status-badge/img/gh/giuseppealbrizio/typescript-rest-api-backend/tree/main.svg?style=svg&circle-token=a73f0879b6f17258a912820c3082a572d49d4ff6)](https://dl.circleci.com/status-badge/redirect/gh/giuseppealbrizio/typescript-rest-api-backend/tree/main)

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/Envoy-VC/awesome-badges)
[![Kubernets](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://github.com/Envoy-VC/awesome-badges)

# Typescript REST API Backend Template

#### Typescript REST microservice boilerplate using node.js and express and some other cool stuff

This template is intended to be used as single service in a REST multi-service application using Cloud Pub/Sub as
message broker

use in local with Skaffold and in cloud with GKE

To know more about how to implement GKE and run with Skaffold please refer to this folder:

`./infra`

The application uses express as framework and is configured with the following features:

- `ECMA2022` features enabled
- `Dotenv` Load environment variables from .env file
- `Eslint` Code quality tool
- `Prettier` to prettify the code
- `MongoDB` ready to go configuration with mongoose
- `MySQL` ready to go configuration with mysql2
- `CORS` feature enabled
- `RBAC` logic to authorize people with specific roles to use the endpoints.
- `Passport` logic to add an authentication layer if neeeded.
- `Sparkpost` email service support with sparkpost.
- `Error Handling` errors custom middleware and helpers globally configured
- `Multer` File uploading configured to use in routes as middleware
- `Google Cloud Storage` middleware configured to use Google Cloud Storage as upload bucket
- `Google Cloud Pub/Sub` pub/sub support for event driven events added
- `Axios` globally configured in `./src/utils/api.utils.js`
- `Swagger` documentation reachable at `http://localhost:3000/api/v1/docs`
- `Jest` Testing tool support
- `Logger` Logging support with Winston
- `Docker` ready configuration with multi-stage option
- `Terraform` ready configuration to instantiate infrastracture in GCP
- `Agenda` ready to emit events through agenda jobs
- `Best practices` in naming files

## Basic Information

- App entry point is located in `./src/index.ts`

- Server config entrypoint is located in `./src/bin/server.ts`

- Prettier config is located at `./.prettierrc.js`

- Eslint config is located at `./.eslintrc`

- Sparkpost service support is located at `./src/services/email/sparkport.service.ts`

  - You can define your own email services in this file

- Mongo config is located at `./src/config/mongodb.config.ts`

- MYSQL config is located at `./src/config/mysql.config.ts`

- Error Handling middleware is located at `./src/middlewares/errorHandler.middleware.ts`

  - You can configure as many errors you need in `./src/errors/`

- Multer middleware is located at `./src/middlewares/upload.middleware.ts`

  - If you want to use Google Cloud Storage as upload bucket follow instructions at `./src/config/gcloud/README.md`

- RBAC logic middleware is located at `./src/middlewares/verifyApiRights.middleware.ts`

- Swagger config file is located at `./src/api/swagger/swagger.route.js`

  - Swagger routes are defined in `./src/api/swagger/swagger.route.ts`

- Docker config is located at `./Dockerfile`

- Pub/Sub service is located at `./src/services/pubsub/pub-sub.service.js`

## Folder Structure

> `infra/`
>
> - **For more information about the k8s configuration please check the README file**
> - **`k8s`** - folder contains all production kubernetes manifests
> - **`k8s-dev`** - folder contains all development kubernetes manifests to run with skaffold
> - **`scripts`** - older contains all script related to the creation of a cluster or running skaffold or secret
>   creation
>
> `src/`
>
> - **`api/`** - containing all api logic with model, services, controller and routes
> - **`bin/`** - server configuration folder
> - **`config/`** - this folder contains all the configs file (database, passport, etc...)
> - **`constants/`** - this folder contains all the global constants
> - **`logs/`** - the logger file will be stored here
> - **`helpers/`** - some helpers func i.e. an error helper that returns json everytime an error comes in
> - **`middlewares/`** - here you can find all the custom middlewares
> - **`services/`** - here we store all the services; i.e. here we define methods to manipulate a db model entity
> - **`tests/`** - here we store all the jest test
> - **`utils/`** - containing some utils function to be reused in the code (i.e. axios global configuration)

## Getting Started

Copy the .env.example to .env. Be sure to fill all the global variables. Alternatively you can use the script `generate-env.sh` in the scripts folder. This script will generate a `.env.test.local` and you can copy this file to .env

```bash
cp env.example .env
```

Then replace:

1. `MONGO_URI` string with your Mongo connection
   1. `MONGO_URI_TEST` string with your Mongo Test connection
2. `MYSQL_HOST_STAGE` string with your mysql host name
   - `MYSQL_USER_STAGE` string with your mysql username
   - `MYSQL_PASSWORD_STAGE` string with your mysql password name
   - `MYSQL_DB_STAGE` string with your mysql db name
   - `MYSQL_SOCKET_STAGE` string with your mysql socket name
3. `GOOGLE_APPLICATION_CREDENTIALS` path with yours
4. `GOOGLE_PROJECT_ID` with yours
5. `SENDGRID_API_KEY` with yours
6. `SENDGRID_SENDER_EMAIL` with yours

In order to Google Cloud Storage works follow instructions located in `./src/config/gcloud/README.md`

---

To get started with this repo npm install in the root folder

```bash
npm install
```

To getting started with a dev environment. Here we use nodemon and babel-node to restart the server asa we change
something

```bash
npm run start:dev
```

To compile the code and create a production build

```bash
npm run compile
```

This command will create a build in the root directory

To start with a production ready build you can run this command

```bash
# This set the NODE_ENV to production, npm-run-all, create a build and run the server command
npm run start
```

If you have a build and you want to node the build you can run

```bash
# This command launch the node instance inside the ./build/bin/server
npm run server
```

## Docker Ready

### Here we use the multistage build to optimize speed and size of the final image

If you use Docker and wanna dockerize the app you can run the command

```bash
docker build -t <dockerhubusername>/<docker-image-name>:<tag> .
```

then

```bash
docker run --name <docker-process-name> -d - p 3000:3000 <dockerhubusername>/<docker-image-name>:<tag>
```
