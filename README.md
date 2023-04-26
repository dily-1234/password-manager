# This is a quick start guide for the Password Manger

## Prerequisites

Before staring the project, you need to install the following:

- Node.js (https://nodejs.org/en/)
- NPM (https://www.npmjs.com/)

## Configuration

To run the applcation successfully, you need to inset the `.env` in the server directory containing the following:

- CONNECTIONURL="YOUR_MONOGO_DB_CONNECTION_URL"
- SALT=10
- SALT1="secretsalt123"
- JWTPRIVATEKEY="sectetykey"
- REGION= "YOUR_AWS_REGION"
- ACCESSKEYID= "YOUR_AWS_ACCESS_KEY_ID"
- SECRETACCESSKEY= "YOUR_AWS_SECRET_ACCESS_KEY"

## Installation

1. Clone the repository to your local machine using `git clone `
2. Navigate to the server directory using `cd server`
3. Install the server dependencies using `npm install`
4. Start the server using `npm start`
5. Navigate to the client directory using `cd ../client`
6. Install the client dependencies using `npm install`
7. Start the client using `npm start`

## Usage

Open a desired web browser and navigate to `http://localhost:3000/` to view the application.
