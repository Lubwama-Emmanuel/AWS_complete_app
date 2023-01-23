const dynamoDB = require("../database/db");
const { v4 } = require("uuid");

const tableName = "AuctionTable-dev";

module.exports.createAuction = async (event, context) => {
  try {
    const { title } = JSON.parse(event.body);

    const items = {
      id: v4(),
      title,
      status: "OPEN",
      createdAt: new Date().toDateString(),
    };

    const item = await dynamoDB
      .put({ TableName: tableName, Item: items })
      .promise();

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

module.exports.getAuctions = async (event, context) => {
  try {
    const auctions = await dynamoDB.scan({ TableName: tableName }).promise();
    console.log(auctions);
    console.log(event);
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

module.exports.getAuctionById = async (event, context) => {
  try {
    const id = event.pathParameters.id;
    console.log(id);
    const auction = await dynamoDB.get({
      TableName: tableName,
      Key: {
        id: id,
      },
    });
    console.log(auction);
    return {
      statusCode: 200,
      body: auction,
    };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }
};
