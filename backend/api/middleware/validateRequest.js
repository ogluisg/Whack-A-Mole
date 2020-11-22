const validateRequestPayload = (requestSchema) => (req, res, next) => {

    let result = requestSchema.validate(req.body)

    if (result.error) return res.status(400).send({error: result.error.details[0].message})
    
    return next();
};

export default validateRequestPayload;