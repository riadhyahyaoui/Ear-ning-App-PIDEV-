const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }

            if (!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {

        authSchema: Joi.object().keys({
            nom: Joi.string().required(),
            prenom: Joi.string().required(),
            ville: Joi.string().required(),
            adresse: Joi.string().required(),
            numero: Joi.number().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirm: Joi.string().required()

        }),
        SignInauthSchema: Joi.object().keys({

            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
}