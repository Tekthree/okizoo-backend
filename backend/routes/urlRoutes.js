const express = require('express');
const router = express.Router();
const {getUrls} = require('../controllers/urlsController.js')

router.get('/', getUrls);
router.post('/', (req, res) => {
  res.status(200).json({ message: 'Set Url' });
});
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update Url ${req.params.id}` });
});
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete Url ${req.params.id}` });
});


module.exports = router;
