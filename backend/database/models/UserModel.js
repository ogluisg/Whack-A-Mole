import { Schema, model, SchemaTypes } from 'mongoose';

const userSchema = new Schema({
    displayName: { type: SchemaTypes.String, required: true },
    email: { type: SchemaTypes.String, required: true},
    password: { type: SchemaTypes.String, required: true },
    points: { type: SchemaTypes.Number, default: 0 },
    verified: { type: SchemaTypes.Boolean, default: false },
});

export default model('Users', userSchema)
