const dynamoDB = require("../database/db");
const { getAuctionById } = require("../lib/functions");
const { placeBidSchema } = require("../lib/schemas/getAuctionsSchema");
const tableName = "AuctionTable-dev";

module.exports.placeBid = async (event, context) => {
  try {
    // const { error } = placeBidSchema.validate(JSON.parse(event.body));
    
    // if (error) {
    //   console.log(error);
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify(error.message),
    //   };
    // }

    const { id } = event.pathParameters;
    const { amount } = JSON.parse(event.body);
    const  bidder  = event.requestContext.authorizer.bidder;
    const auction = await getAuctionById(id);

    // Auction status validation
    if (auction.status === "CLOSED") {
      throw new Error("The auction is closed already, you cannot bid on it");
    }

    // Avoiding sellers from bidding on their products
    if (bidder === auction.seller) {
      throw new Error("A seller is not allowed to bid on their own items");
    }

    // Avoid bidder bidding twice
    // if (auction.highestBid.bidder === bidder) {
    //   throw new Error("You cannot bid twice");
    // }

    // Checking if the bidding price is not less than the highest bid
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
      UpdateExpression:
        "set highestBid.amount = :amount, highestBid.bidder = :bidder",
      ExpressionAttributeValues: {
        ":amount": amount,
        ":bidder": bidder,
      },
      ReturnValues: "ALL_NEW",
    };

    const updatedAuction = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(event),
    };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 404,
      body: JSON.stringify(err),
    };
  }
};
