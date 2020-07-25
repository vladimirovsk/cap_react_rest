
//model_auth = require('../models/auth');

async function execQuery(model, params, connection) {
    return connection.query(model, params); // returns result of query using pool connect from params "connection"
}


module.exports = {
      execQuery
   }
