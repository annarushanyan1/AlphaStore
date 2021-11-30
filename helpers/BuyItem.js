const { db } = require('./../server');

exports.BuyItem = function (req) {
    let itemId = req.body["itemId"];
    let userId = req.body["userId"];

    let date = String(new Date());

    let sql = `Select * from buyedList where userId = ${userId}`
    let currentRows = [];
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            currentRows.push(row)
        });

        if (currentRows.length == 0) {
            let arr = [];
            arr.push(itemId);

            arr = JSON.stringify(arr)
            let sql = `Insert into buyedList values (${userId},"${arr}","${date}")`
            db.run(sql)
        } else {
            let sql = `Select productIds from buyedList where userId = ${userId}`
            let prd = "";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach(
                    (row) => {
                        prd = row;
                    }
                )
                let arr = JSON.parse(prd.productIds);
                arr.push(itemId);
                arr = JSON.stringify(arr);
                let sql = `Update buyedList set productIds = "${arr}" where userId = ${userId}`
                db.run(sql)
            }
            );
        }
    });
}