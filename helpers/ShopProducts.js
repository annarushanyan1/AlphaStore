exports.ShopProducts = function (res) {
    let sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('./db/sql.db', (err) => {
        if (err) {
            console.log("innnnnn")
            return console.error(err);
        }
        console.log('Connected to the in-memory SQlite database.');
    });

    let products = [];
    let sql = `SELECT * FROM products`;

    const myPromise = new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                products.push(row)
            });

            resolve(products);

        })
    });

    myPromise.then(
        (products) => {
            res.json(
                {
                    'products': products
                }
            )
            return products
        }
    )
    db.close()

}