const dynamoDB = require("../database/db");
const { v4 } = require("uuid");

// const tableName = process.env.TABLE_NAME;
const tableName = "AuctionTable-dev";

module.exports.createAuction = async (event, context) => {
  try {
    const { title } = JSON.parse(event.body);
    const now = new Date();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    const items = {
      id: v4(),
      title,
      status: "OPEN",
      createdAt: now.toISOString(),
      highestBid: {
        amount: 0,
      },
      endingAt: expires.toISOString(),
    };

    await dynamoDB.put({ TableName: tableName, Item: items }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }
};
