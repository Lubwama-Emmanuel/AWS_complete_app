const dynamoDB = require("../database/db");
const tableName = "AuctionTable-dev";

module.exports.endedAuctions = async () => {
  const now = new Date();

  const params = {
    TableName: tableName,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items;
};
