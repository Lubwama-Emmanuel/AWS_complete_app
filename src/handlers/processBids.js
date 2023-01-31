const { endedAuctions } = require("../lib/getEndedAuctions");
const { closeAuctions } = require("../lib/closeAuction");

module.exports.processBids = async (event) => {
  try {
    const auctions = await endedAuctions();
    const closePromises = auctions.map((auction) => closeAuctions(auction));
    await Promise.all(closePromises);
    return { closed: closePromises.length };
  } catch (err) {
    console.log("AN ERROR OCCURED", err);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }
};
