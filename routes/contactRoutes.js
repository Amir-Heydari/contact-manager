const express = require('express');
const router = express.Router();
const contactControllers = require('../controllers/contactController');
const { validateToken } = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.route("/").get(contactControllers.getContacts);

router.route("/:id").get(contactControllers.getContact);

router.route("/").post(contactControllers.createContact);

router.route("/:id").put(contactControllers.updateContact);

router.route("/:id").delete(contactControllers.deleteContact);

module.exports = router;