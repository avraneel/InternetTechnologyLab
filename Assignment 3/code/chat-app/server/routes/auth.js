const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlleware/authMiddleware')
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/public', requireAuth, authController.public_get);
router.get('/logout', authController.logout_get);
router.get('/home', requireAuth, authController.home_get);

module.exports = router;