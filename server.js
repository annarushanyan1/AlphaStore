const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs')


var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");
const { json } = require('express');
app.use(express.json({ limit: '1mb' }));

let users = []
let products = [];
let contactList = [];
let sqlite3 = require('sqlite3').verbose();

tokenGenerator();
let sendedtoken = '';
let valid;
function workWithDb(func, data) {
    let db = new sqlite3.Database('./db/sql.db');

    if (func == 'getProducts') {
        let sql = `SELECT * FROM products`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                products.push(row)
            });

        })
    }

    if (func == 'get') {
        let sql = `SELECT * FROM users`;
        let prod = [];
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {

                if (row['products'] == '' || row['products'] == undefined) {
                    row['products'] = [];
                    prod = []
                }

                users.push(row)
            });
        });
    }

    if (func == 'insert') {
        let sql = data;
        db.run(sql)
    }
    if (func == 'updateProduct') {
        let sss = data;
        let sql = `UPDATE users
            SET products = ?
            WHERE id = ?`;

        db.run(sql, sss, function (err) {
            if (err) {
                return console.error(err.message);
            }

        });
    }

    if (func == 'getToken') {
        let id = data;
        let sql = `Select token from tokenUserId where userId = ${id}`
        let token = '';
        const promise = new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    token = row['token']
                    resolve(token);
                });
            }
            );
        });
        promise.then(
            (item) => {
                token = item;
            }
        )

        setTimeout(
            () => {
                sendedtoken = token;
                return token;
            }, 100
        )
    }

    if (func == "validation") {
        let array = data;
        let sql = `Select * from tokenUserId where userId = ${array[0]}`
        let Onerow = [];
        const promise = new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    Onerow.push(row)
                });
                if (Onerow[0]) {
                    valid = true;
                    resolve(true)

                } else {
                    resolve(false)
                }

            }
            );
        });

        promise.then(
            (item) => {
                if (item) {
                    valid = true
                } else {
                    valid = false
                }
                return valid
            }
        ).then(
            (item) => {
                return item
            }
        )
        return valid;

    }
    // close the database connection
    db.close();
}


workWithDb('getProducts');
workWithDb('get');

function tokenGenerator() {
    let db = new sqlite3.Database('./db/sql.db');
    let sql = `SELECT * FROM users`;
    let userdata = [];
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            userdata.push([row['id'], row['password']])
        });


        let sqlDelete = 'DELETE FROM tokenUserId';
        db.run(sqlDelete);

        for (let i = 0; i < userdata.length; i++) {
            let user = { id: userdata[i][0] };
            let token = jwt.sign({ user }, userdata[i][1]);
            let sqlInsert = `INSERT INTO tokenUserId VALUES (${userdata[i][0]},"${token}")`
            db.run(sqlInsert);
        }

    });



    db.close();

}




users.map(
    (user) => {
        if (user[products] == "") {
            user[products] = []
        }
    }
)

let userdata = {};

function checkf(username, password) {
    workWithDb('get')
    for (let i = 0; i < users.length; i++) {
        if (users[i]['username'] == username && users[i]['password'] == password) {
            isUser = true;
            userdata = users[i];
            console.log("is user")
            return 0
        }
    }
    return 1
}

app.post('/api/login', (req, res) => {
    let user = req.body;

    let login = user["username"]

    let pass = user["password"]

    var bytes = CryptoJS.AES.decrypt(pass, 'my-secret-key@123');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    let check = checkf(login, decryptedData)

    const promise = new Promise((resolve, reject) => {
        let token = workWithDb("getToken", userdata["id"]);
        if (token == undefined || token == '') {
            resolve(sendedtoken)
        }
    });

    promise.then(
        (token) => {
            console.log('tokeninpromise:', token);
            res.json(
                {
                    'isUser': check,
                    'userId': userdata["id"],
                    'fullname': userdata['firstname'] + " " + userdata['lastname'],
                    'products': JSON.stringify(userdata['products']),
                    'token': token,
                    'productsCount': JSON.parse(userdata['products']).length
                }
            )
        }
    );



});

app.get('/api/users', (req, res) => {

    res.json(users)
});
app.post('/api/addToCart', (req, res) => {
    workWithDb('get')
    let itemId = req.body["itemId"];
    let userId = req.body["userId"];
    let token = req.body["token"];
    let arr = [userId, token]
    let isUser = workWithDb("validation", arr);
    console.log(isUser)
    if (true) {
        let sendingAgainToClient = {};
        for (let i = 0; i < users.length; i++) {
            if (users[i]['id'] == Number(userId)) {
                let img = '';
                for (let i = 0; i < products.length; i++) {
                    if (products[i]['id'] == itemId) {
                        img = products[i]['img']
                    }
                }
                sendingAgainToClient = {
                    id: Number(itemId),
                    img: img
                }

                let prd;
                if (users[i]['products'].length > 5) {
                    prd = JSON.parse(users[i]['products'])
                } else {
                    prd = [];
                }
                prd.push(
                    sendingAgainToClient
                )
                users[i]['products'] = JSON.stringify(prd)

                workWithDb('updateProduct', [users[i]['products'], users[i]["id"]])
                res.json(
                    {
                        "sendingAgainToClient": sendingAgainToClient
                    }
                )

                break
            }
        }
    }
})




app.post(
    '/api/registration', (req, res) => {
        let success = true;
        let newUser = req.body;
        let firstname = newUser['firstname']
        let lastname = newUser['lastname']
        let username = newUser['username']

        for (let i = 0; i < users.length; i++) {
            if (users[i]['username'] == newUser['username']) {
                success = false;
            }
        }
        var bytes = CryptoJS.AES.decrypt(newUser['password'], 'my-secret-key@123');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        let password = decryptedData;

        let newId = users[users.length - 1]['id'] + 1;
        if (success) {
            users.push(
                {
                    id: newId,
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    password: password,
                    products: JSON.stringify([])
                }
            )
            let nulll = ''
            let str = `INSERT INTO users VALUES(${newId},"${firstname}","${lastname}","${username}","${password}","${nulll}")`
            workWithDb("insert", String(str));

            tokenGenerator();



        }
        res.json(
            {
                "success": success
            }
        )

    }
)



app.listen(port, () => console.log(`Listening on port ${port}`));



app.get('/api/products', (req, res) => {
    res.json(products)
})


app.post(
    '/api/deleteElem', (req, res) => {

        let userId = req.body['userId']
        let itemId = req.body['itemId']
        console.log(387, userId, itemId)

        let key = -1;

        if (users[userId - 1]['products'] == "") {
            users[userId - 1]['products'] == JSON.stringify([])
        }

        let prd = JSON.parse(users[userId - 1]['products']);

        let index = prd.map(
            (item) => {
                key++;
                if (item['id'] == itemId) {
                    return key;
                }
            }
        )
        prd.splice(index, 1);
        let jsonForDb = JSON.stringify(prd);
        users[userId - 1]['products'] = jsonForDb;

        let array = [jsonForDb, userId]
        workWithDb("updateProduct", array)

    }
)

app.post(
    '/api/update', (req, res) => {
        let userId = req.body["userId"];
        let data = req.body["products"];
        let token = req.body["token"];

        let arr = [userId, token];
        const promise = new Promise((resolve, reject) => {
            let isUser = workWithDb("validation", arr);
            console.log(414, isUser);
            resolve(isUser);
        });
        promise.then(
            (item) => {
                if (item) {
                    let array = [data, userId]
                    workWithDb("updateProduct", array)
                    res.json(
                        {
                            "done": true
                        }
                    )
                    for (let i = 0; i < users.length; i++) {
                        if (users[i]["id"] == Number(userId)) {
                            users[i]["products"] = data;

                        }

                    }
                } else {
                    res.json(
                        {
                            "done": false
                        }
                    )
                }
            }
        )

    }
)

app.get(

    '/api/shopProducts', (req, res) => {
        res.json(
            {
                'products': products
            }
        )
    }

)


//Countuct Us
app.post(
    '/api/contactUs', (req, res) => {

        let fullname = req.body["name"];
        let email = req.body["email"];
        let message = req.body["message"];
        let subscribed = req.body["subscribed"];
        let selected = req.body["selected"];

        const myPromise = new Promise((resolve, reject) => {

            let db = new sqlite3.Database('./db/sql.db');
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
            db.close();
        });
        let str;
        myPromise.then(
            (res) => {
                console.log(482, res)
                let list = res;
                let newId = list[list.length - 1]["ID"] + 1;
                console.log("newId", newId)
                if (newId == undefined) {
                    newId = 1;
                }

                str = `INSERT INTO contactUs VALUES(${newId},"${fullname}","${email}","${message}","${subscribed}","${selected}")`
                workWithDb("insert", str);
                return "done"
            }
        ).then(
            () => {
                setTimeout(
                    () => {
                        writeCSV();
                    }, 100
                )
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        )
    }
)



app.post(
    '/api/getProductsByCategory', (req, res) => {
        let product_name = req.body['name'];

        let db = new sqlite3.Database('./db/sql.db');
        let sql = `Select * from products where name = "${product_name}"`
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
)


app.post(
    '/api/productsById', (req, res) => {
        let id = req.body["userId"];
        let productsById = [];
        if (id) {
            let db = new sqlite3.Database('./db/sql.db');
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
                for (let i = 0; i < prd.length; i++) {
                    let itemId = prd[i]['id'];
                    for (let j = 0; j < products.length; j++) {
                        if (products[j]["id"] == itemId) {

                            prd[i]['price'] = products[j]["price"];

                        }
                    }
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
)

function writeCSV() {
    let db = new sqlite3.Database('./db/sql.db');
    let sql = 'Select * from contactUs';
    let data = [];
    db.all(sql, [], (err, rows) => {

        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            data.push(row)
        });
        let header = Object.keys(data[0]);
        let str = '';
        data.map(
            item => {
                let values = [];
                for (const key in item) {
                    if (key == 'message') {
                        let mess = item[key] + "";
                        let newMess = mess.split(',').join(' |');
                        values.push(newMess);

                    } else {
                        values.push(item[key])
                    }

                }
                str += values + '\n'
            }
        );
        str = header + '\n' + str;
        fs.writeFile('messeges.csv', str, err => {
            if (err) {
                console.error(err)
                return
            }

        })

    })
    db.close();
}



app.post(
    '/api/buyItem', (req, res) => {
        let itemId = req.body["itemId"];
        let userId = req.body["userId"];

        let date = String(new Date());
        let db = new sqlite3.Database('./db/sql.db');
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
)