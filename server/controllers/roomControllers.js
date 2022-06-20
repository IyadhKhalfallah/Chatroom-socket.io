const Room = require('../models/Room');
const { isRoomFull } = require('../helpers/roomHelpers')
module.exports.isRoomFull = async (req, res) => {
    const { room_id } = req.body
    if (!room_id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({ status: 400, message: "Room ID is not valid" })
        return;
    }
    const roomFull = await isRoomFull(Room, room_id)
    res.json(roomFull)
}