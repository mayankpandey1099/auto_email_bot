/**
 * Sends an automatic reply to a received email.
 * extract name and email from the messageDetails
 *
 * @async
 * @function sendAutoReply
 * @param {Object} serviceProvider - The service provider object (e.g., Google Gmail API).
 * @param {Object} messageDetails - Details of the received email message.
 */

const sendAutoReply = async (serviceProvider, messageDetails) => {
  try {
    const messageId = messageDetails.id;
    const extractNameFromEmail = (emailAddress) => {
      const match = emailAddress.match(/(.+?)\s?<.+>/);
      return match ? match[1] : emailAddress;
    };
    const fromName = extractNameFromEmail(
      messageDetails.payload.headers.find((header) => header.name === "From")
        .value
    );

    const email = messageDetails.payload.headers.find(
      (header) => header.name === "From"
    ).value;

    const generatedReply =
      "Hi " +
      fromName +
      ",\n\nThanks for reaching out. Mayank will get back to you soon.\n\nRegards,\nMayank";

    const emailSubject = "Regarding Your Recent Email";

    const rawMessage = Buffer.from(
      "To: " +
        email +
        "\r\n" +
        "Subject: Re: " +
        emailSubject +
        "\r\n\r\n" +
        generatedReply
    ).toString("base64");

    await serviceProvider.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });
    console.log("Reply sent successfully to email with id:", messageId);
  } catch (error) {
    return "Error generating or sending reply message: " + error.message;
  }
};

module.exports = { sendAutoReply };
