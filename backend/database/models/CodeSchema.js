import { Schema, model, SchemaTypes } from 'mongoose';

const code = new Schema({
    email: { type: SchemaTypes.String, required: true },
    code:  { type: SchemaTypes.String, required: true },
    dateCreated: { type: SchemaTypes.Date, default: Date.now() }
})

export default model('code', code)