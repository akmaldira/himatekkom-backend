const router = require('express').Router();
const {
    signUpHandler,
    signInHandler,
    logoutHandler,
} = require('../controller/user');
const { refreshToken } = require('../controller/refreshToken');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/signup', signUpHandler);
router.post('/signin', signInHandler);
router.delete('/logout', logoutHandler);
router.get('/dashboard', verifyToken);
router.get('/auth', refreshToken);

module.exports = router;
