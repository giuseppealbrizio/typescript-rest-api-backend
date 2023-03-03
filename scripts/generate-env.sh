#!/bin/sh

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if .env file exists and delete
echo "${YELLOW}Deleting old .env file...${NC}"
rm -f ./.env.test.local

# Greet user
echo "${CYAN}Hello! Let's set up your environment variables.${NC}"

# Ask user for variable content
# Ask user for variable content and validate input
while true; do
    read -p "What is the HOST? [0.0.0.0] " HOST
    # HOST=${HOST:-0.0.0.0} # set default value for PORT
    if [ -z "$HOST" ]; then
        echo "${RED}HOST cannot be blank. Please enter a value.${NC}"
    else
        break
    fi
done

# Ask user for variable content and validate input
while true; do
    read -p "What is the port you want to run the server on? [3000] " PORT
    # PORT=${PORT:-3000} # set default value for PORT
    if [ -z "$PORT" ]; then
        echo "${RED}PORT cannot be blank. Please enter a value.${NC}"
    else
        break
    fi
done

while true; do
    read -p "What is the name of the service? " SERVICE_NAME
    if [ -z "$SERVICE_NAME" ]; then
        echo "${RED}SERVICE_NAME cannot be blank. Please enter a value.${NC}"
    else
        break
    fi
done

while true; do
    read -p "What is your JWT_KEY? " JWT_KEY
    if [ -z "$JWT_KEY" ]; then
        echo "${RED}JWT_KEY cannot be blank. Please enter a value.${NC}"
    else
        break
    fi
done

while true; do
    read -p "What is your SECRET? " SECRET
    if [ -z "$SECRET" ]; then
        echo "${RED}SECRET cannot be blank. Please enter a value.${NC}"
    else
        break
    fi
done

HASH=10 # set default value for HASH

read -p "What is the path to your Google Application Credentials file? [./src/config/gcloud/google-application-credentials.json] " GOOGLE_APPLICATION_CREDENTIALS
GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_APPLICATION_CREDENTIALS:-./src/config/gcloud/google-application-credentials.json} # set default value for GOOGLE_APPLICATION_CREDENTIALS

read -p "What is your Google Cloud project ID? " GOOGLE_PROJECT_ID
read -p "What is your Google Cloud Storage bucket name? " GOOGLE_STORAGE_BUCKET_NAME
read -p "What is your Google Client ID? " GOOGLE_CLIENT_ID
read -p "What is your Google Client Secret? " GOOGLE_CLIENT_SECRET
read -p "What is your Google Maps API key? " GOOGLE_MAPS_API_KEY

read -p "What is your CLIENT_URL? [http://localhost:3000] " CLIENT_URL
CLIENT_URL=${CLIENT_URL:-http://localhost:3000} # set default value for CLIENT_URL

read -p "What is your MongoDB URI? [mongodb://localhost:27017/database_name] " MONGO_URI
MONGO_URI=${MONGO_URI:-mongodb://localhost:27017/database_name} # set default value for MONGO_URI

read -p "What is your MongoDB test URI? [mongodb://localhost:27017/test_database_name] " MONGO_URI_TEST
MONGO_URI_TEST=${MONGO_URI_TEST:-mongodb://localhost:27017/test_database_name} # set default value for MONGO_URI_TEST

read -p "What is your MongoDB username? " MONGO_USER
MONGO_USER=${MONGO_USER:-'your_mongo_user'} # set default value for MONGO_USER and add single quotes around the value

read -p "What is your MongoDB password? " MONGO_PASS
MONGO_PASS=${MONGO_PASS:-'your_mongo_password'} # set default value for MONGO_PASS and add single quotes around the value

read -p "What is your MySQL staging host? " MYSQL_HOST_STAGE
MYSQL_HOST_STAGE=${MYSQL_HOST_STAGE:-'your_myql_host_stage'} # set default value for MYSQL_HOST_STAGE and add single quotes around the value

read -p "What is your MySQL staging user? " MYSQL_USER_STAGE
MYSQL_USER_STAGE=${MYSQL_USER_STAGE:-'your_myql_user'} # set default value for MYSQL_USER_STAGE and add single quotes around the value

read -p "What is your MySQL staging password? " MYSQL_PASSWORD_STAGE
MYSQL_PASSWORD_STAGE=${MYSQL_PASSWORD_STAGE:-'your_myql_pass'} # set default value for MYSQL_PASSWORD_STAGE and add single quotes around the value

read -p "What is your MySQL staging database? " MYSQL_DB_STAGE
MYSQL_DB_STAGE=${MYSQL_DB_STAGE:-'your_myql_db_name'} # set default value for MYSQL_DB_STAGE and add single quotes around the value

read -p "What is your MySQL staging socket? " MYSQL_SOCKET_STAGE
MYSQL_SOCKET_STAGE=${MYSQL_SOCKET_STAGE:-'/your/socket-cloud-sql'} # set default value for MYSQL_SOCKET_STAGE and add single quotes around the value

read -p "What is your MySQL production host? " MYSQL_HOST_PROD
MYSQL_HOST_PROD=${MYSQL_HOST_PROD:-'your_myql_host_stage'} # set default value for MYSQL_HOST_PROD and

read -p "What is your MySQL production user? " MYSQL_USER_PROD
MYSQL_USER_PROD=${MYSQL_USER_PROD:-'your_myql_user'} # set default value for MYSQL_USER_PROD and add single quotes around the value

read -p "What is your MySQL production password? " MYSQL_PASSWORD_PROD
MYSQL_PASSWORD_PROD=${MYSQL_PASSWORD_PROD:-'your_myql_pass'} # set default value for MYSQL_PASSWORD_PROD and add single quotes around the value

read -p "What is your MySQL production database? " MYSQL_DB_PROD
MYSQL_DB_PROD=${MYSQL_DB_PROD:-'your_myql_db_name'} # set default value for MYSQL_DB_PROD and add single quotes around the value

read -p "What is your MySQL production socket? " MYSQL_SOCKET_PROD
MYSQL_SOCKET_PROD=${MYSQL_SOCKET_PROD:-'/your/socket-cloud-sql'} # set default value for MYSQL_SOCKET_PROD and add single quotes around the value

read -p "What is your SparkPost API key? " SPARKPOST_API_KEY
SPARKPOST_API_KEY=${SPARKPOST_API_KEY:-'your_sparkpost_api_key'} # set default value for SPARKPOST_API_KEY and add single quotes around the value

read -p "What is your SparkPost sender domain? " SPARKPOST_SENDER_DOMAIN
SPARKPOST_SENDER_DOMAIN=${SPARKPOST_SENDER_DOMAIN:-'your_sparkpost_sender_domain'} # set default value for SPARKPOST_SENDER_DOMAIN and add single quotes around the value

read -p "What is your MessageBird Access Key? " MESSAGEBIRD_ACCESS_KEY
MESSAGEBIRD_ACCESS_KEY=${MESSAGEBIRD_ACCESS_KEY:-'your_messagbird_access_key'} # set default value for MESSAGEBIRD_ACCESS_KEY and add single quotes around the value

read -p "What is your MessageBird WhatsApp Channel ID? " MESSAGEBIRD_WHATSAPP_CHANNEL_ID
MESSAGEBIRD_WHATSAPP_CHANNEL_ID=${MESSAGEBIRD_WHATSAPP_CHANNEL_ID:-'your_messagebird_whatsapp_channel_id'} # set default value for MESSAGEBIRD_WHATSAPP_CHANNEL_ID and add single quotes around the value

read -p "What is your MessageBird Template Namespace ID? " MESSAGEBIRD_TEMPLATE_NAMESPACE_ID
MESSAGEBIRD_TEMPLATE_NAMESPACE_ID=${MESSAGEBIRD_TEMPLATE_NAMESPACE_ID:-'your_messagebird_template_namespace_id'} # set default value for MESSAGEBIRD_TEMPLATE_NAMESPACE_ID and add single quotes around the value

# Write variables to .env file one level up from the script's location
echo "# SERVER CONFIGURATION" >> ./.env.test.local
echo "HOST=${HOST}" >> ./.env.test.local
echo "PORT=${PORT}" >> ./.env.test.local
echo "SERVICE_NAME='${SERVICE_NAME}'" >> ./.env.test.local

echo "# JWT CONFIGURATION" >> ./.env.test.local
echo "JWT_KEY='${JWT_KEY}'" >> ./.env.test.local
echo "SECRET='${SECRET}'" >> ./.env.test.local
echo "HASH=${HASH}" >> ./.env.test.local

echo "# MONGO DB CONFIGURATION" >> ./.env.test.local
echo "MONGO_URI='${MONGO_URI}'" >> ./.env.test.local
echo "MONGO_URI_TEST='${MONGO_URI_TEST}'" >> ./.env.test.local
echo "MONGO_USER='${MONGO_USER}'" >> ./.env.test.local
echo "MONGO_PASS='${MONGO_PASS}'" >> ./.env.test.local

echo "# GOOGLE CLOUD CONFIGURATION" >> ./.env.test.local
echo "GOOGLE_APPLICATION_CREDENTIALS='${GOOGLE_APPLICATION_CREDENTIALS}'" >> ./.env.test.local
echo "GOOGLE_PROJECT_ID='${GOOGLE_PROJECT_ID}'" >> ./.env.test.local
echo "GOOGLE_STORAGE_BUCKET_NAME='${GOOGLE_STORAGE_BUCKET_NAME}'" >> ./.env.test.local
echo "GOOGLE_CLIENT_ID='${GOOGLE_CLIENT_ID}'" >> ./.env.test.local
echo "GOOGLE_CLIENT_SECRET='${GOOGLE_CLIENT_SECRET}'" >> ./.env.test.local
echo "GOOGLE_MAPS_API_KEY='${GOOGLE_MAPS_API_KEY}'" >> ./.env.test.local

echo "# CLIENT CONFIGURATION" >> ./.env.test.local
echo "CLIENT_URL='${CLIENT_URL}'" >> ./.env.test.local

echo "# MYSQL CONFIGURATION DEVELOPMENT" >> ./.env.test.local
echo "MYSQL_HOST_STAGE='${MYSQL_HOST_STAGE}'" >> ./.env.test.local
echo "MYSQL_USER_STAGE='${MYSQL_USER_STAGE}'" >> ./.env.test.local
echo "MYSQL_PASSWORD_STAGE='${MYSQL_PASSWORD_STAGE}'" >> ./.env.test.local
echo "MYSQL_DB_STAGE='${MYSQL_DB_STAGE}'" >> ./.env.test.local
echo "MYSQL_SOCKET_STAGE='${MYSQL_SOCKET_STAGE}'" >> ./.env.test.local

echo "# MYSQL CONFIGURATION PRODUCTION" >> ./.env.test.local
echo "MYSQL_HOST_PROD='${MYSQL_HOST_PROD}'" >> ./.env.test.local
echo "MYSQL_USER_PROD='${MYSQL_USER_PROD}'" >> ./.env.test.local
echo "MYSQL_PASSWORD_PROD='${MYSQL_PASSWORD_PROD}'" >> ./.env.test.local
echo "MYSQL_DB_PROD='${MYSQL_DB_PROD}'" >> ./.env.test.local
echo "MYSQL_SOCKET_PROD='${MYSQL_SOCKET_PROD}'" >> ./.env.test.local

echo "# SPARKPOST CONFIGURATION" >> ./.env.test.local
echo "SPARKPOST_API_KEY='${SPARKPOST_API_KEY}'" >> ./.env.test.local
echo "SPARKPOST_SENDER_DOMAIN='${SPARKPOST_SENDER_DOMAIN}'" >> ./.env.test.local

echo "# MESSAGEBIRD CONFIGURATION" >> ./.env.test.local
echo "MESSAGEBIRD_ACCESS_KEY='${MESSAGEBIRD_ACCESS_KEY}'" >> ./.env.test.local
echo "MESSAGEBIRD_WHATSAPP_CHANNEL_ID='${MESSAGEBIRD_WHATSAPP_CHANNEL_ID}'" >> ./.env.test.local
echo "MESSAGEBIRD_TEMPLATE_NAMESPACE_ID='${MESSAGEBIRD_TEMPLATE_NAMESPACE_ID}'" >> ./.env.test.local

# Success message
echo "${GREEN}Your environment variables have been written to ./.env.test.local. Thank you for using this script!${NC}"
echo "${GREEN}Please make sure to copy the .evn.test.local file to .env before going to production.${NC}"
