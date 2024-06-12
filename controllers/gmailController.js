const { google } = require("googleapis");
const { sendAutoReply } = require("../utils/gmailReply");
const tokenStore = require("../utils/tokenStore");

const gmailHandler = async (req, res) => {

  const {accessToken, refreshToken} = tokenStore;

  if(!accessToken && !refreshToken){
    return res.status(404).json({error: "accessToken and refreshToken not provided"});
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/google/callback"
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
      q: "is:unread from:mayankpandey1099@gmail.com",
    });
    const messages = response.data.messages;
    if (!messages) {
      return res.status(200).send("No unread emails found.");
    }
    for (const message of messages) {
      const messageDetails = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });
      await sendAutoReply(gmail, messageDetails.data);
    }
    res.status(200).send("Auto reply enabled successfully!");
  } catch (error) {
    console.error("Error generating or sending reply message:", error);
    res
      .status(500)
      .send("Error generating or sending reply message: " + error.message);
  }
};


module.exports = { gmailHandler };
