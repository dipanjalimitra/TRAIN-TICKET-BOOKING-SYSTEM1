import mongoose from 'mongoose';
const { Schema, } = mongoose;

const regularTicketSchema = new Schema({
    userId: { type: String, required: true },
    sourceStation: { type: Object, required: true },
    destinationStation: { type: Object, required: true },
    numberOfPassengers: { type: Number, required: true },
    distance: { type: Number, required: false },
    fare: { type: Number, required: false },
    isPaid: { type: Boolean, default: false },
    ticketData: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now },
});

const RegularTicket = mongoose.model('regularTicket ', regularTicketSchema);

export default RegularTicket;