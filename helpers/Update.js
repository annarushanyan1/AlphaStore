const {db} = require('./../server')

exports.Update = function (array) {

    let sql = `UPDATE users
    SET products = ?
    WHERE id = ?`;

    db.run(
        sql, array, function (err) {
            console.log(err)
        }
    )
}


