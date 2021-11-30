const { db } = require('./../server')

exports.ProductsByCategory = function (name, res) {
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


}