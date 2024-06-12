# Auto Email Bot

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Explanation](#explanation)
  - [Passport.js](#passportjs)
  - [Gmail Handler](#gmail-handler)
  - [Token Storage](#token-storage)

## Introduction

The Auto Email Bot is a Node.js application that connects to the Gmail account of user and automatically replies to unread emails from specific senders. This project uses Google APIs to access Gmail and Passport.js for authentication.

## Features

- Authenticate and authorization with Google by passport.js using OAuth2
- Automatically reply to unread emails from specific senders
- Avoid sending duplicate replies to the same email

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/auto-email-bot.git
   cd auto-email-bot

2. Install dependencies:
   ```sh
   npm install

3. Set up the environment variables. Create a .env file in the root of the project and add the following
  ```env
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  ```

## Usage 

1. Start the server:
   ```sh
   npm start

2. Open your browser and navigate to `http://localhost:3000/auth/google`

3. Authenticate with your Google account. And will redirect you to `http://localhost:3000/auth/google/callback` to get the accessToken and refreshToken.

4. The bot will start checking for unread emails from specific senders and automatically reply to them.

## Configuration

- `Polling Interval`: The email bot checks for new emails at regular intervals. This is set in the startPolling function for calling gmailHandler.js.
- `Sender Email Filter`: Modify the query in the gmail.users.messages.list method to change the filter criteria for unread emails with particular id.
- `Set to Store Processed Message IDs`: The processedMessageIds set is used to store the IDs of emails that have already been processed.
- `Check Before Sending a Reply`: Before sending an auto-reply, the code checks if the message ID is in the processedMessageIds set. If it is, the code skips that message. Otherwise, it sends the reply and adds the message ID to the set.

## Project Structure

```bash
auto_email_bot
      ├── controllers
      │   └── gmailController.js
      ├── routes
      │   └── googleRouter.js
      ├── utils
      │   ├── gmailReply.js
      │   ├── tokenStore.js
      ├── .env
      ├── server.js
      ├── package.json
      └── README.md
```

## Conclusion

- This project demonstrates how to build an auto email bot using Node.js, the Google API, and Passport.js for authentication. It covers handling OAuth tokens, interacting with the Gmail API, and avoiding duplicate email replies.




