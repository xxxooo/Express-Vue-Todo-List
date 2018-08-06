
module.exports = (sequelize, Sequalize) => (
  sequelize.define('Todo', {
    title: Sequalize.STRING,
    completed: Sequalize.BOOLEAN,
    creator: Sequalize.STRING,
  })
);
