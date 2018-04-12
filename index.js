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
  const meta = {"limit": limit, "offset": offset};
  // var film_info = {};
  var recommendation_ids = [];
  let sql = `SELECT id
            FROM films
            WHERE genre_id IN (SELECT genre_id
            FROM films
            WHERE id = ${id})`;


  // let sql2 = `SELECT *
  //           FROM films
  //           CROSS JOIN genres 
  //           WHERE films.id = ${id}
  //           ORDER BY films.id`;

  db.each(sql, (err, row) => {
  if (err) {
    throw err;
  }

  recommendation_ids.push(row.id);
  var recommendations_list = [];
//   recommendation_ids.map(el => {
//     axios({
//       method: 'get',
//       url: `http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=${el}`
//     })
//       .then(resp => {
//         // res.json(resp.data);
//         reviews = resp.data[0].reviews;
//         var ratings = [];
//         reviews.map(el => ratings.push(el.rating));
//         var sum = ratings.reduce((previous, current) => current += previous);
//         var averageRating =  Math.round(sum / reviews.length * 100) / 100;
//         // console.log('averageRating is', averageRating);
//         if (averageRating > 4 && reviews.length >= 5) {
//           recommendations_list.push(el);
//           // console.log('el is', el);
//         };
//       // console.log('recom list is', recommendations_list);
//       res.json(recommendations_list);
//       next();
//       })
//       .catch(error => {
//          console.log('error encountered in axios call error: ', error);
//          next(error);
//       });
//     })
//   });
// }
  // console.log('recommendation_ids', recommendation_ids);
  
  // const title = row.title;
  // const film_id = row.id;
  // const releaseDate = row.release_date;
  // const genre = row.name;
  // const reviews = 0;
  // film_info = {"id": film_id, "title": title, "releaseDate": releaseDate, "genre": genre};
  // }; 

  // var recommendations_list = [];
  if (recommendation_ids.length > 0){
    axios({
      method: 'get',
      url: `http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=${recommendation_ids}`
    })
      .then(resp => {
        resp.data.map(el => {
          reviews = el.reviews;
          var ratings = [];
          reviews.map(el => ratings.push(el.rating));
          if (ratings.length > 0) {
          var sum = ratings.reduce((previous, current) => current += previous);
          var averageRating =  Math.round(sum / reviews.length * 100) / 100;
            if (averageRating > 4 && reviews.length >= 5) {
              recommendations_list.push(el.film_id);
            };
          };
        })
        console.log("recommendations_list is", recommendations_list);
        next();
      })
      .catch(error => {
        console.log('error encountered in axios call error: ', error);
        next(error);
      });
    }
  });
};

module.exports = app;
