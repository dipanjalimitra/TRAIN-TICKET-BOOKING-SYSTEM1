import mongoose from 'mongoose';
const { Schema } = mongoose;

const stationSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date, default: Date.now },
});

const Station = mongoose.model('station', stationSchema);

export default Station;