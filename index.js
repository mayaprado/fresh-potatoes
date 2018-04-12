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
  const limit = 10;
  const offset = 0;
  let sql = `SELECT *
            FROM films
            CROSS JOIN genres 
            WHERE films.id = ${id}
            ORDER BY films.id`;

  db.each(sql, (err, row) => {
  if (err) {
    throw err;
  }
  const meta = {"limit": limit, "offset": offset};
  const title = row.title;
  const film_id = row.id;
  const releaseDate = row.release_date;
  const genre = row.name;
  const averageRating = 0;
  const reviews = 0;
  const recommendations = [{"id": film_id, "title": title, "releaseDate": releaseDate, "genre": genre}]
  res.json({meta, recommendations});
  // res.json({meta, recommendations});
  console.log(`${row.title}`, id);
  console.log('id is', id);
  });  
}

module.exports = app;
