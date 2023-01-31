const dynamoDB = require("../database/db");
const tableName = "AuctionTable-dev";

module.exports.getAuctionById = async (id) => {
  let auction;
  try {
    const result = await dynamoDB
      .get({
        TableName: tableName,
        Key: {
          id,
        },
      })
      .promise();
    auction = result.Item;
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
