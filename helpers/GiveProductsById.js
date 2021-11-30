exports.GiveProductsById = function (id, res) {
    let sqlite3 = require('sqlite3').verbose();

    let db = new sqlite3.Database('./db/sql.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });

    let productsById = [];

    if (id) {
        let sql = `SELECT products FROM users where id = ${id}`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }

            rows.forEach(
                (row) => {
                    productsById.push(row);
                }
            )

            let prd = [];

            if (productsById[0]["products"].length > 5) {
                prd = JSON.parse(productsById[0]["products"]);
            }
            let setId = new Set();
            prd.map(
                item => {
                    setId.add(
                        item['id']
                    )
                }

            );

            let arrayfromSet = Array.from(setId)
            let filteredList = [];
            for (let i = 0; i < arrayfromSet.length; i++) {
                for (let j = 0; j < prd.length; j++) {
                    if (prd[j]["id"] == arrayfromSet[i]) {
                        filteredList.push(prd[j])
                        break
                    }
                }
            }
            let idANDcount = [];
            for (let i = 0; i < arrayfromSet.length; i++) {
                let itemId = arrayfromSet[i]
                let arr = [itemId];
                let count = 0;
                for (let j = 0; j < prd.length; j++) {
                    if (prd[j]["id"] == itemId) {
                        count++;
                    }
                }
                arr.push(count);
                idANDcount.push(arr);
            }

            for (let i = 0; i < idANDcount.length; i++) {
                let count = idANDcount[i][1];
                filteredList[i]["count"] = count;
            }

            res.json(
                {
                    products: JSON.stringify(prd),
                    filteredList: filteredList
                }
            )
        }
        );
        db.close();
    }
}
