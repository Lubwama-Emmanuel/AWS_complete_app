const { getAuctionById } = require("../lib/functions");

module.exports.getAuction = async (event, context) => {
  try {
    const { id } = event.pathParameters;
    // console.log(id);

    const result = await getAuctionById(id);
    console.log("here is the result", result);
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
