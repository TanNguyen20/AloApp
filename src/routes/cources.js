const express = require('express');
const router = express.Router();

const Courcecontroller = require('../app/controllers/CourceControllers');

router.get('/create', Courcecontroller.create);
router.post('/store', Courcecontroller.store);
router.put('/:id', Courcecontroller.update);
router.patch('/:id/restore/', Courcecontroller.restore);
router.delete('/:id', Courcecontroller.delete);
router.delete('/:id/force', Courcecontroller.forceDelete);
router.get('/:id/edit', Courcecontroller.edit);

router.get('/:slug', Courcecontroller.show);

module.exports = router;
