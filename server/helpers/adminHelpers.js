const getCommonRooms = async (Room, idA, idB) => {
    const rooms = await Room.find({ users: { $all: [idA, idB] } });
    return rooms
}

const getDirectRelations = async (Room, user) => {
    console.log('USER: ', user)
    const userRooms = await Room.find({ users: { $all: user } })
    return userRooms.map(room => room.users).flat()
}

const getSecondDegreeRelations = async (Room, idA, idB) => {
    let userADirectRelations = await getDirectRelations(Room, idA)
    let userBDirectRelations = await getDirectRelations(Room, idB)

    userADirectRelations = userADirectRelations.map(String)
    userBDirectRelations = userBDirectRelations.map(String)

    return userADirectRelations.filter(value => userBDirectRelations.includes(value));
}

const getThirdDegreeRelations = async (Room, idA, idB) => {
    const thirdDegreeUsers = []

    let userADirectRelations = await getDirectRelations(Room, idA)
    let userBDirectRelations = await getDirectRelations(Room, idB)

    userADirectRelations = userADirectRelations.map(String)
    userBDirectRelations = userBDirectRelations.map(String)

    // Using the traditional for loop because there is an await in a nested loop (Does not work properly with callbacks)
    for (const valueA of userADirectRelations) {
        for (const valueB of userBDirectRelations) {
            const commonRooms = await getCommonRooms(Room, valueA, valueB)
            if (commonRooms && commonRooms.length) thirdDegreeUsers.push([valueA, valueB])
        }
    }

    return thirdDegreeUsers
}
module.exports = {
    getCommonRooms,
    getSecondDegreeRelations,
    getThirdDegreeRelations,
    getDirectRelations,
}