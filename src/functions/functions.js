const dynamoDB = require('../database/db')

module.exports.getAuctionById = async (id) => {
    let auction;
    try {
      const result = await dynamoDB.get({
        TableName: tableName,
        Key: {
          id,
        },
      });
      auction = result.item
    } catch (err) {
      console.log("AN ERROR OCCURED", err);
      return {
        statusCode: 200,
        body: JSON.stringify(err),
      };
    }

    if(!auction){
        console.log('Auction doesnt exist')
    }
    return auction;
  };