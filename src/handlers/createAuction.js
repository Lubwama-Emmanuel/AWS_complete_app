const dynamoDB = require("../database/db");
const auctionSchema = require("../lib/schemas/getAuctionsSchema");
const { v4 } = require("uuid");

// const tableName = process.env.TABLE_NAME;
const tableName = "AuctionTable-dev";

module.exports.createAuction = async (event, context) => {
  try {
    // const { error } = auctionSchema.validate(JSON.parse(event.body));

    // if (error) {
    //   console.log(error);
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify(error),
    //   };
    // }

    const { title } = JSON.parse(event.body);
    const seller = event.requestContext.authorizer.email;

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
        bidder: "",
      },
      endingAt: expires.toISOString(),
      seller,
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
