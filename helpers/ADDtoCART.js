exports.ADDtoCART = function (id, userId) {

    let sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('./db/sql.db', (err) => {

        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });

    const myPromise = new Promise((resolve, reject) => {
        let sql = `Select * from products where id = ${id}`
        let OneProduct = {}
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                OneProduct = row;
            });
            console.log(233, OneProduct)
            let sql = `Select products from users where id = ${userId};`
            let products = "";

            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    products = row;
                });
                let one = OneProduct;

                // if(products == "" || ){
                //     products="[]"
                // }
                console.log(404, products)

                products = JSON.parse(products["products"])
                products.push(one)
                products = JSON.stringify(products)
                console.log(265, products)
                resolve(products)

            })
            db.close()


        })

    })
    myPromise.then(
        (prd) => {
            let db = new sqlite3.Database('./db/sql.db', (err) => {

                if (err) {
                    return console.error(err.message);
                }
                console.log('Connected to the in-memory SQlite database.');
            });

            console.log(userId)

            let sql = `UPDATE users
            SET products = ?
            WHERE id = ?`;

            db.run(sql, [prd, userId], function (err) {
                if (err) {
                    console.error(err);
                }
            });
            db.close()
        }
    )
}