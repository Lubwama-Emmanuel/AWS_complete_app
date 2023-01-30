const Joi = require('joi');

module.exports.auctionSchema = Joi.object().keys({
    title: Joi.string().required()
})

module.exports.queryStringSchema = Joi.object().keys({
    status: Joi.string().valid('OPEN', 'CLOSED').default('OPEN')
})

module.exports.placeBidSchema = Joi.object().keys({
    amount: Joi.number().required().error(new Error('Must provide bidding amount'))
})