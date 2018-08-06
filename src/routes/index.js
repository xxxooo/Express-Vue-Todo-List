const router = require('express').Router();

// GET root page
router.get('/', (req, res) => {
  res.render('index', { title: 'TODO LIST' });
});

module.exports = router;
