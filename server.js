const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");
const { json } = require('express');
app.use(express.json({ limit: '1mb' }));

let users = []
let products = [];
let contactList = [];
let sqlite3 = require('sqlite3').verbose();
//_______________________________________________________


// open the database
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

    //getToken
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
                    console.log("row: ", row)
                    token = row['token']
                    resolve(token);
                });
            }
            );
        });
        promise.then(
            (item) => {
                token = item;
                console.log("97: ", item);
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
        let array = data;//data= [userid, token];
        let sql = `Select * from tokenUserId where userId = ${array[0]}`
        let Onerow = [];
        const promise = new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    console.log("row 120: ", row)
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

//giving token to the users 
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

        console.log("aaa", userdata);

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

tokenGenerator();


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
            // console.log(users[i])
            userdata = users[i];
            console.log("is user")
            return 0
        }
    }
    return 1
}

app.post('/api/login', (req, res) => {
    // workWithDb('get');//users 
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
                    'firstname': userdata['firstname'],
                    'lastname': userdata['lastname'],
                    'products': JSON.stringify(userdata['products']),
                    'token': token
                }
            )
        }
    );
    // userdata = {};
    // isUser = false;

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
    if (isUser) {
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

                let prd = JSON.parse(users[i]['products'])

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

        // let jsonForDb = JSON.stringify(sendingAgainToClient);

        // let array = [jsonForDb,userId]

        // workWithDb("updateProduct",array) 
    } else {
        res.json(
            {
                "isUser": false
            }
        )
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
            // workWithDb("insert", String(str));
            tokenGenerator();
            // workWithDb("insert", String(str));


        }
        res.json(
            {
                "success": success
            }
        )

    }
)


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route


app.get('/api/products', (req, res) => {
    res.json(products)
})


app.post(
    '/api/deleteElem', (req, res) => {


        let userId = req.body['userId']
        let itemId = req.body['itemId']

        let key = -1;

        if (users[userId - 1]['products'] == "") {

            users[userId - 1]['products'] == JSON.stringify([])

        }

        let prd = JSON.parse(users[userId - 1]['products']);

        let index = prd.map(
            (item) => {
                key++;
                if (item['id'] == itemId) {
                    return key
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


///___________________
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
                    // let jsonForDb = JSON.stringify(sendingAgainToClient);
                    let array = [data, userId]
                    // console.log(array)
                    console.log("updating");
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
                    // workWithDb("updatelogout",data)
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
                resolve(contactList);
            });
            db.close();

        });
        let newId, str;
        myPromise.then(
            (res) => {
                let list = res;
                newId = list[list.length - 1]["ID"] + 1;
                str = `INSERT INTO contactUs VALUES(${newId},"${fullname}","${email}","${message}","${subscribed}","${selected}")`
                workWithDb("insert", str);

            }
        ).catch(
            (err) => {
                console.log(err);
            }
        )
    }
)


