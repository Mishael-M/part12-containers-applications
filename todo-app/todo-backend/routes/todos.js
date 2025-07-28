const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('../redis/index');


/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  let value = await getAsync("addedTodos");
  await setAsync("addedTodos", ++value);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
// Finished
singleRouter.get('/', async (req, res) => {
  if (!req.todo) return res.status(404).send('Todo not found');
  res.json(req.todo);
});

/* PUT todo. */
// Finished
singleRouter.put('/', async (req, res) => {
  if (!req.todo) return res.status(404).send('Todo not found');
  req.todo.text = req.body.text;
  req.todo.done = req.body.done;
  res.json(req.todo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
