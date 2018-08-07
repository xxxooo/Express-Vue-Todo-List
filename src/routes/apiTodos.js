const router = require('express').Router();
const { Todo } = require('../models');

// middleware
function checkIDInput(req, res, next) {
  if (Number.isNaN(req.params.id)) {
    res.status(400).json('Invalid ID supplied');
  } else {
    next();
  }
}

function checkIDExist(req, res, next) {
  Todo
    .count({
      where: { id: req.params.id },
    })
    .then((count) => {
      if (count !== 0) {
        next();
      } else {
        res.status(400).json(`Can't find Todo with id: ${req.params.id}`);
      }
    });
}

// READ all todos
router.get('/', (req, res) => {
  Todo
    .findAll({
      attributes: ['id', 'title', 'date', 'completed'],
    })
    .then((todos) => {
      res.status(200).json(todos);
    })
    .error((err) => {
      res.status(404).json(err);
    });
});

// CREATE new todo
router.post('/', (req, res) => {
  Todo
    .create({
      title: req.body.title,
      detail: req.body.detail,
      creator: req.body.creator,
      date: req.body.date,
      completed: req.body.completed,
    }).then((todo) => {
      res.status(200).json(todo);
    }).error((err) => {
      res.status(405).json(err);
    });
});

// READ todo
router.get('/:id', [checkIDInput, checkIDExist], (req, res) => {
  Todo
    .findById(req.params.id)
    .then((todo) => {
      res.status(200).json(todo);
    })
    .error((err) => {
      res.status(405).json(err);
    });
});

// UPDATE todo
router.patch('/:id', [checkIDInput, checkIDExist], (req, res) => {
  Todo
    .update({
      title: req.body.title,
      detail: req.body.detail,
      creator: req.body.creator,
      date: req.body.date,
      completed: req.body.completed,
    }, {
      where: { id: req.params.id },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .error((err) => {
      res.status(405).json(err);
    });
});

// DELETE todo
router.delete('/:id', [checkIDInput, checkIDExist], (req, res) => {
  Todo
    .destroy({
      where: { id: req.params.id },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .error((err) => {
      res.status(405).json(err);
    });
});

module.exports = router;
