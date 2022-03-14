const router = require('express').Router();
const {
    signUpHandler,
    signInHandler,
} = require('../controller/user');

router.post('/signup', signUpHandler);
router.post('/signin', signInHandler);

module.exports = router;
