const User = require("../models/User");
const Room = require("../models/Room");
const { getCommonRooms, getSecondDegreeRelations, getThirdDegreeRelations } = require('../helpers/adminHelpers')

module.exports.getCommonRooms = async (req, res) => {
    const { userA, userB } = req.query

   const rooms = await getCommonRooms(Room, userA, userB)
   res.json(rooms)
}

module.exports.getRelationDegree = async (req, res) => {
    const { userA, userB } = req.query
    if (userA && userB) {
        const rooms = await getCommonRooms(Room, userA, userB)
        if (rooms && rooms.length) {
            res.json({degree: '1st', rooms})
            return;
        }
        const secondDegreeUsers = await getSecondDegreeRelations(Room, userA, userB)
        if (secondDegreeUsers && secondDegreeUsers.length) {
            res.json({ degree: '2nd', second_degrees: await Promise.all(secondDegreeUsers.map(async userID => await User.findById(userID))) })
            return;
        }

        const thirdDegreeUsers = await getThirdDegreeRelations(Room, userA, userB)

        if (thirdDegreeUsers && thirdDegreeUsers.length) {
            res.json({ degree: '3rd', third_degrees: thirdDegreeUsers })
            return;
        }
        res.json({message: 'Out of network'})
        return;
    }
    res.status(400).json({ status: 400, message: "Please specify both users" })
}