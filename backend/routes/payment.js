const express = require('express');
const router = express.Router();

const { processPayment, sendStripeApi } = require('../controllers/paymentController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/stripeapi').get(sendStripeApi);
module.exports = router;