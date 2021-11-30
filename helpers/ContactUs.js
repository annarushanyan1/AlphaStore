let commonFunctions = require('./common.js')
exports.ContactUs = function (req) {
    let fullname = req.body["name"];
    let email = req.body["email"];
    let message = req.body["message"];
    let subscribed = req.body["subscribed"];
    let selected = req.body["selected"];


    let contactList = [];
    const myPromise = new Promise((resolve, reject) => {

        let sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('./db/sql.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the in-memory SQlite database.');
        });
        let sql = "SELECT * FROM contactUs";
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                contactList.push(row);
            });

            if (contactList == undefined) {
                contactList = []
            }
            resolve(contactList);
        });
        db.close()

    });

    myPromise.then(
        (list) => {//der add ytac chi
            let sqlite3 = require('sqlite3').verbose();
            let db = new sqlite3.Database('./db/sql.db', (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Connected to the in-memory SQlite database.');
            });
            let newId = list[list.length - 1]["ID"] + 1;


            if (newId == undefined) {
                newId = 1;
            }

            let arr = [newId, fullname, email, message, subscribed, selected]
            sql = `INSERT INTO contactUs VALUES(?,?,?,?,?,?)`
            db.run(sql, arr, function (err) {
                if (err) {
                    console.error(err);
                }
            });
            list.push(
                {
                    "ID": newId,
                    "fullname": fullname,
                    "email": email,
                    "message": message,
                    "subscribed": subscribed,
                    "selected": selected
                }
            )
            return list
        }
    )
    myPromise.then(
        (list2) => {
            commonFunctions.writeCSV(list2)
        }
    )
}
