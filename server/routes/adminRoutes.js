const { Router } = require('express');
const adminController = require('../controllers/adminControllers');
const router = Router();
router.get('/common-rooms', adminController.getCommonRooms)
router.get('/relation-degree', adminController.getRelationDegree)

module.exports = router;