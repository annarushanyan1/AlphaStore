const { db } = require('../server');
exports.CheckUser = function (username, password, res) {
    let sql = `Select * from users where username = "${username}" and password = "${password}"`

    let user = {};

    const myPromise = new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                user = row;
            });
            resolve(user)

        })
    });
    myPromise.then(
        (user) => {
            if (Object.keys(user).length === 0) {
                console.log("not user")
                res.json(
                    {
                        'isUser': 2
                    }
                )
                return
            }
            res.json(
                {
                    'isUser': 0,
                    'userId': user["id"],
                    'fullname': user['firstname'] + " " + user['lastname'],
                    'products': JSON.stringify(user['products']),
                    'productsCount': JSON.parse(user['products']).length
                }
            )
        }
    )
}
