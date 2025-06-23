import jwt from 'jsonwebtoken';

async function verifyTicket(req, res) {

    const { ticket } = req.body;

    // validate the request
    if (!ticket) {
        return res.json({ "status": "error", "message": "Invalid request" });
    }

    const secret = process.env.TICKET_ENCRYPTION_SECRET;

    // verify the ticket
    jwt.verify(ticket, secret, (err, decoded) => {
        if (err) {
            return res.json({ "status": "error", "message": "Invalid ticket", "data": decoded });
        }

        console.log(decoded);
        const ticketType = decoded.type;

        return res.json({ "status": "success", "message": "Ticket verified successfully", "data": decoded });
    });
}

export default verifyTicket;