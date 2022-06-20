require('should')

const { getSecondDegreeRelations, getDirectRelations } = require('../helpers/adminHelpers')

const ROOMS = [{ users: ['id1', 'id2'] }, { users: ['id1', 'id4'] }]
const Room = {
    find: ({ users: { $all: id }}) => ROOMS.filter(room => room.users.includes(id))
}
describe('Relations test', () => {
    it('Should flatten direct relations and return them', async () => {
        const flattenedRelations = await getDirectRelations(Room, 'id1')
        flattenedRelations.should.be.eql(['id1', 'id2', 'id1', 'id4'])
    });
    it('Should properly get second degree relations', async () => {
        const secondDegreeRelations = await getSecondDegreeRelations(Room, 'id2', 'id4')
        secondDegreeRelations.should.be.eql(['id1'])
    });
});