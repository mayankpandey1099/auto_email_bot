const { google } = require("googleapis");
const { sendAutoReply } = require("../utils/gmailHelper");
const tokenStore = require("../utils/tokenStore");
const processedMessageIds = new Set();

/**
 * Creates Oath2Client for authenticate to google, credential set in Oath2Client
 * Creates instance of gmail api with authenticated Oauth2Client
 * Makes an api call for listing unread emails with filtered result
 * Check for current message ID has already been processed
 * Gets full details of current message and api call for sending auto reply
 * @async
 * @function gmailHandler
 * @throws Will throw an error if accessToken or refreshToken are not provided.
 */

const gmailHandler = async () => {

  const {accessToken, refreshToken} = tokenStore;

  if(!accessToken && !refreshToken){
    throw new Error("accessToken && refreshToken not provided");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: `is:unread from:${process.env.EMAIL}`,
    });
    const messages = response.data.messages;
    if (!messages) {
      return
    }
    
    for (const message of messages) {

      if (processedMessageIds.has(message.id)) {
        continue;
      }
      const messageDetails = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });
      await sendAutoReply(gmail, messageDetails.data);
      processedMessageIds.add(message.id);
    }
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * Starts the polling process for the Gmail handler every 3 sec.
 * 
 * @function startPolling
 */

const startPolling = ()=> {
  setInterval(gmailHandler, 3000);
}
module.exports = { startPolling };
