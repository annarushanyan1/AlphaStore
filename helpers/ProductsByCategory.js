exports.ProductsByCategory = function (name, res) {
    let sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('./db/sql.db', (err) => {
        if (err) {
            console.log("innnnnn2")

            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });

    let sql = `Select * from products where name = "${name}"`
    let array = [];
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            array.push(row)
        });

        res.json(
            {
                products: JSON.stringify(array)
            }
        )
    })
    db.close()


}