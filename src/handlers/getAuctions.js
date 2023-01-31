const dynamoDB = require("../database/db");
const tableName = "AuctionTable-dev";
const { queryStringSchema } = require("../lib/schemas/getAuctionsSchema");
const queryString = require("querystring");

module.exports.getAuctions = async (event) => {
  try {
    const { status } = event.queryStringParameters;
    const queryParams = queryString.parse(event.queryStringParameters);
    const { error } = queryStringSchema.validate(queryParams);

    if (error) {
      console.log(error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    }

    const params = {
      TableName: tableName,
      IndexName: "statusAndEndDate",
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeValues: {
        ":status": status,
      },
      ExpressionAttributeNames: {
        "#status": "status",
      },
    };

    const auctions = await dynamoDB.query(params).promise();
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
