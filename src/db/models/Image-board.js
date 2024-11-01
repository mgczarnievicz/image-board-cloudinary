// db/models/Joke.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const imageSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
});

const image =
    mongoose.models['image-board'] || mongoose.model('Image', imageSchema);

export default image;
