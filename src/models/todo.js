
module.exports = (sequelize, Sequalize) => (
  sequelize.define('Todo', {
    title: Sequalize.STRING,
    detail: Sequalize.STRING,
    creator: Sequalize.STRING,
    date: Sequalize.STRING,
    completed: Sequalize.BOOLEAN,
    eventId: Sequalize.STRING,
  })
);
