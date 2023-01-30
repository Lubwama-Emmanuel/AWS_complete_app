const dynamoDB = require('../database/db')
const tableName = "AuctionTable-dev";

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