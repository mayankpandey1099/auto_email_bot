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
    console.log(fromName, "this is fromName");

    const email = messageDetails.payload.headers.find(
      (header) => header.name === "From"
    ).value;

    const generatedReply =
      "Hi " +
      fromName +
      ",\n\nThanks for reaching out. Ram will get back to you soon.\n\nRegards,\nMayank";

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
    console.error("Error generating or sending reply message:", error);
    return "Error generating or sending reply message: " + error.message;
  }
};


module.exports = {sendAutoReply};