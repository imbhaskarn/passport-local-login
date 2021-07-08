const Joi = require('joi')

const authSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    password: Joi.string().min(6).max(30).alphanum().required()
})

module.exports= {
    authSchema, Joi
}