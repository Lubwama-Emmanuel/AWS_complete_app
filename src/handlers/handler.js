"use strict";
const AWS = require("aws-sdk");

const ses = new AWS.SES({ region: "us-east-2" });

module.exports.sendEmail = async (event) => {
  const record = event.Records[0];
  console.log("record processing");

  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;

  const params = {
    Source: "lubwamaemmanuel1@gmail.com",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };
  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }
};
