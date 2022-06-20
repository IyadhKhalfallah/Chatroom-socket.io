require('should')

const { isRoomFull } = require('../helpers/roomHelpers')

const ROOMS = [{ id: 'id1', users: ['id1', 'id2'] }, { id: 'id2', users: ['id1', 'id4'] }]
const Room = {
    findById: (id) => ROOMS.filter(room => room.id === id)[0]
}
describe('Full room test', () => {
    it('Should flatten direct relations and return them', async () => {
        const fullRoom = await isRoomFull(Room, 'id1')
        fullRoom.should.be.false
    });
});