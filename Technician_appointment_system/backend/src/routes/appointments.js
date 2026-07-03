const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointmentController');
const { validateCreate, validateUpdate } = require('../middleware/validate');

router.get('/', controller.getAllAppointments);
router.get('/:id', controller.getAppointmentById);
router.post('/', validateCreate, controller.createAppointment);
router.put('/:id', validateUpdate, controller.updateAppointment);
router.patch('/:id/status', controller.updateAppointmentStatus);
router.delete('/:id', controller.deleteAppointment);

module.exports = router;
