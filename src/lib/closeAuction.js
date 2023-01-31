const dynamoDB = require("../database/db");
const tableName = "AuctionTable-dev";

module.exports.closeAuctions = async (auction) => {
  const params = {
    TableName: tableName,
    Key: {
      id: auction.id,
    },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ReturnValues: "ALL_NEW",
  };

  const closedAuction = await dynamoDB.update(params).promise();
  return closedAuction;
};
