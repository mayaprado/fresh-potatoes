const sqlite = require('sqlite'),
      sqlite3 = require('sqlite3'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

let db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to SQlite database.');
});

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);

// ROUTE HANDLER
function getFilmRecommendations(req, res, next) {
  const id = req.params.id;
  let sql = `SELECT Title title
            FROM films
            WHERE films.id = ${id}
            ORDER BY Title`;

  db.each(sql, (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.title}`, id);
  console.log('id is', id);
  });  
}

module.exports = app;
