const router = require('express').Router();

const { getMyInfo, updateMyProfile } = require('../controllers/users');

router.get('/me', getMyInfo);
router.patch('/me', updateMyProfile);

module.exports = router;
