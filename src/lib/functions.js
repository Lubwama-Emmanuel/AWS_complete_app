const dynamoDB = require("../database/db");
const tableName = "AuctionTable-dev";

module.exports.getAuctionById = async (id) => {
  let auction;
  console.log("We reachin");
  try {
    const result = await dynamoDB.get({
      TableName: tableName,
      Key: {
        id,
      },
    });
    console.log(result)
    auction = result.item;
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }

  if (!auction) {
    console.log("Auction doesnt exist");
  }
  return auction;
};
