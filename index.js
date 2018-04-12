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

const axios = require ('axios');

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);

// ROUTE HANDLER
function getFilmRecommendations(req, res, next) {
  const id = req.params.id;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 10;
  var film_info = {};
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
  film_info = {"id": film_id, "title": title, "releaseDate": releaseDate, "genre": genre};
  res.send({film_info});
  });  

  axios({
    method: 'get',
    url: `http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=8`
  })
    .then(resp => {
      res.json(resp.data);
      next();
    })
    .catch(error => {
      console.log('error encountered in axios call error: ', error);
      next(error);
    });
}

module.exports = app;
