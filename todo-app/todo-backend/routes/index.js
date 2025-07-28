const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const redis = require('../redis')
const { getAsync, setAsync } = require('../redis/index');


let visits = 0


/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* Exercise 12.10 */
router.get('/statistics', async (req, res) => {
  let addedTodos = await getAsync("addedTodos");
  if (addedTodos == null) {
    await setAsync("addedTodos", 0)
    res.send({ addedTodos: 0 })
  } else {
    res.send({ addedTodos: addedTodos })
  }
})

module.exports = router;
