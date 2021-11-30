const { db } = require('./../server')

exports.Registration = function (req, res) {
    let newUser = req.body;

    let firstname = newUser['firstname']
    let lastname = newUser['lastname']
    let username = newUser['username']
    let password = newUser['password']

    const myPromise = new Promise((resolve, reject) => {
        let sql = `Select * from users where username = "${username}"`
        let existedUser = false;

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(err)
                throw err;
            }
            rows.forEach(
                (row) => {
                    if (row) {
                        existedUser = true;
                        res.json(
                            {
                                "success": false
                            }
                        )
                        return
                    }
                }
            )
            resolve(existedUser)

        })
    })

    myPromise.then(
        (existed) => {

            if (!existed) {
                let sql = `
                SELECT COUNT(*)
                FROM users;`

                let newId = 0;

                db.all(sql, [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    rows.forEach(
                        (row) => {
                            newId = row["COUNT(*)"] + 1;
                        }
                    )

                    let sql = `INSERT INTO users VALUES(${newId},"${firstname}","${lastname}","${username}","${password}","${"[]"}")`
                    db.run(sql)
                    res.json(
                        {
                            "success": true
                        }
                    )

                })


            }
        }
    )
}
