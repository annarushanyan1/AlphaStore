const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

var CryptoJS = require("crypto-js");
const { json } = require('express');
app.use(express.json({ limit: '1mb' }));

let users = []
let products = [];
let sqlite3 = require('sqlite3').verbose();



// open the database

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
  if(func == 'getIdFromContact')
  {
    let sql = `SELECT * FROM contactUs`;
    let array = [];
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        array.push(row)
      });
  });
  return array.length;
}
    // close the database connection
  db.close();


}

workWithDb('getProducts')
workWithDb('get')


users.map(
  (user) => {
    if (user[products] == "") {
      user[products] = []
    }
  }
)



let userdata = {};
function check(username, password) {
  workWithDb('get')

  for (let i = 0; i < users.length; i++) {
    if (users[i]['username'] == username && users[i]['password'] == password) {
      isUser = true;
      console.log(users[i])
      userdata = users[i];
      console.log("is user")
      return 0
    }
  }
  return 1
}

app.post('/api/login', (req, res) => {
  workWithDb('get');
  let user = req.body;
  let login = user["username"]
  let pass = user["password"]


  var bytes = CryptoJS.AES.decrypt(pass, 'my-secret-key@123');
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));



  let otvet = check(login, decryptedData)
  console.log("133333:      " + JSON.stringify(userdata['products']))
  
  res.json(
    {
      'isUser': otvet,
      'userId': userdata["id"],
      'firstname': userdata['firstname'],
      'lastname': userdata['lastname'],
      'products': JSON.stringify(userdata['products']),
      'soccess': "iii dont know"
    }
  )
  // userdata = {};
  // isUser = false;

})
app.get('/api/users', (req, res) => {

  res.json(users)
})

app.post('/api/addToCart', (req, res) => {
  workWithDb('get')
  let itemId = req.body["itemId"];
  userId = req.body["userId"];

  let sendingAgainToClient = {};

  for (let i = 0; i < users.length; i++) {
    if (users[i]['id'] == Number(userId)) {
      let img = ''
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

      workWithDb('updateProduct',[users[i]['products'],users[i]["id"]])
      res.json(
        {
          "sendingAgainToClient": sendingAgainToClient
        }
      )

      break
    }
  }

  // let jsonForDb = JSON.stringify(sendingAgainToClient);
  // console.log("json: "+jsonForDb)

  // let array = [jsonForDb,userId]

  // workWithDb("updateProduct",array) 

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
  
  // console.log('decryptedData:',decryptedData)

    let password = decryptedData;

    console.log(users)
    
    let newId = users[users.length - 1]['id'] + 1;
    //stugel ardyuq ka aydpiti user
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

      // console.log(users[users.length - 1])
    }
    // console.log(success)
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
  //  console.log(users)
  res.json(products)
})


app.post(
  '/api/deleteElem', (req, res) => {
    // console.log(req.body)

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
    // let jsonForDb = JSON.stringify(sendingAgainToClient);
    console.log("updateee:  ",data)
    let array = [data, userId]
console.log(array)
    workWithDb("updateProduct", array)
    res.json(
      {
        "done": true
      }
    )
    for (let i = 0; i < users.length; i++) {
      if(users[i]["id"]== Number(userId)){
        users[i]["products"] = data;
        
      }
      
    }
    // workWithDb("updatelogout",data)

  }
)

app.get(

  '/api/shopProducts',(req, res) => {
res.json(
  {
    'products':products
  }
)
}
  
)


//Countuct Us

app.post(
  '/api/contactUs', (req, res) => {
    // console.log(req.body)

let fullname = req.body["name"];
let email = req.body["email"];
let message = req.body["message"];
let subscribed = req.body["subscribed"];
let selected = req.body["selected"];

let newId = workWithDb("getIdFromContact") + 1;
let str = `INSERT INTO contactUs VALUES(${newId},"${fullname}","${email}","${message}","${subscribed}","${selected}")`

workWithDb("insert",str);

  }
)