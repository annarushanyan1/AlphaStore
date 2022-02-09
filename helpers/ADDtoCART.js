const { db } = require('./../server');

exports.ADDtoCART = function (id, userId) {
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
                products = JSON.parse(products["products"])
                products.push(one)
                products = JSON.stringify(products)

                resolve(products)

            })



        })

    })
    myPromise.then(
        (prd) => {


            let sql = `UPDATE users
            SET products = ?
            WHERE id = ?`;

            db.run(sql, [prd, userId], function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    )
}