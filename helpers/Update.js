exports.Update = function (array) {

    let sqlite3 = require('sqlite3').verbose();

    let db = new sqlite3.Database('./db/sql.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });

    let sql = `UPDATE users
    SET products = ?
    WHERE id = ?`;

    db.run(
        sql, array, function (err) {
            console.log(err)
        }
    )
}


