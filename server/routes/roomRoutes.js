const { Router } = require('express');
const roomController = require('../controllers/roomControllers');
const router = Router();
router.post('/is-room-full', roomController.isRoomFull)

module.exports = router;