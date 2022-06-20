const { ROOM_LIMIT } = require('../domain/constants')

const isRoomFull = async (Room, room_id) => {
    const room = await Room.findById(room_id)
    return room.users.length <= ROOM_LIMIT
}
module.exports = {
    isRoomFull,
}