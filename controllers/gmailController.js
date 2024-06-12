const { google } = require("googleapis");
const { sendAutoReply } = require("../utils/gmailHelper");
const tokenStore = require("../utils/tokenStore");


const processedMessageIds = new Set();
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

const startPolling = ()=> {
  setInterval(gmailHandler, 3000);
}
module.exports = { startPolling };
