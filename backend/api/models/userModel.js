import Joi from 'joi'

export const signupSchema = Joi.object({
    displayName: Joi.string().required('displayName'),
    email: Joi.string().email().required().label('email'),
    password: Joi.string().min(4).required().label("password")
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required().label('email'),
    password: Joi.string().min(4).required().label("password")
})

export const updateSchema = Joi.object({
    points: Joi.number().required().min(1).label('points')
})
