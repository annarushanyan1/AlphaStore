const {db} = require('./../server')

exports.ShopProducts = function (res) {

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
    // db.close()

}