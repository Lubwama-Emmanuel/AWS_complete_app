const dynamoDB = require("../database/db");
const { getAuctionById } = require("../lib/functions");
const { v4 } = require("uuid");

// const tableName = process.env.TABLE_NAME;
const tableName = "AuctionTable-dev";

module.exports.createAuction = async (event, context) => {
  try {
    const { title } = JSON.parse(event.body);
    const now = new Date()
    const expires = new Date();
    expires.setHours(expires.getHours() + 1)

    const items = {
      id: v4(),
      title,
      status: "OPEN",
      createdAt: now.toISOString(),
      highestBid: {
        amount: 0,
      },
      endedAt: expires
    };

    await dynamoDB
      .put({ TableName: tableName, Item: items })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }
};

module.exports.getAuctions = async (event, context) => {
  try {
    const auctions = await dynamoDB.scan({ TableName: tableName }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(auctions),
    };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }
};

module.exports.getAuction = async (event, context) => {
  try {
    const { id } = event.pathParameters;
    // console.log(id);

    const result = await getAuctionById(id);
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

module.exports.placeBid = async (event, context) => {
  try {
    const { id } = event.pathParameters;
    const { amount } = event.body;

    const auction = await getAuctionById(id);

    if (auction.highestBid.amount >= amount) {
      console.log("The bid amount must be higher than the highest bid made");
    }

    const params = {
      TableName: tableName,
      key: {
        id,
      },
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionAttributeValues: {
        ":amount": amount,
      },
      ReturnValues: "ALL_NEW",
    };

    const updatedAuction = await dynamoDB.patch(params).promise;

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 404,
      body: JSON.stringify(err),
    };
  }
};
