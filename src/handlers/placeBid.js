const dynamoDB = require("../database/db");
const { getAuctionById } = require("../lib/functions");
const tableName = "AuctionTable-dev";

module.exports.placeBid = async (event, context) => {
  try {
    const { id } = event.pathParameters;
    const { amount } = JSON.parse(event.body);
    // console.log(event)

    const auction = await getAuctionById(id);

    if (auction.highestBid.amount >= amount) {
      throw new Error(
        "The bid amount must be higher than the highest bid made"
      );
    }

    const params = {
      TableName: tableName,
      Key: {
        id,
      },
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionAttributeValues: {
        ":amount": amount,
      },
      ReturnValues: "ALL_NEW",
    };

    const updatedAuction = await dynamoDB.update(params).promise();

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
