const express = require('express');

const app = express();

app.use(express.json({ limit: '1mb' }));

app.listen(5001);

let sqlite3 = require('sqlite3')
let db = new sqlite3.Database('./helpers/db/sql.db')
exports.db = db;

const sqlfunctions = require('./helpers/FUNCTIONS.js')

app.get('/api/shopProducts', function (req, res) {
    sqlfunctions.ShopProducts(res);
});

app.post('/api/getProductsByCategory', (req, res) => {
    sqlfunctions.ProductsByCategory(req.body['name'], res);
}
);

app.post('/api/login', (req, res) => {
    sqlfunctions.CheckUser(req.body["username"], req.body["password"], res)
});



app.post('/api/productsById', (req, res) => {
    sqlfunctions.GiveProductsById(req.body["userId"], res);
}

)


app.post('/api/addToCart', (req, res) => {
    sqlfunctions.ADDtoCART(req.body["itemId"], req.body["userId"], res)
})

app.post(
    '/api/update', (req, res) => {
        sqlfunctions.Update([req.body["products"], req.body["userId"]]);
    }
)

app.post(
    '/api/registration', (req, res) => {
        sqlfunctions.Registration(req, res)
    }
)

app.post(
    '/api/contactUs', (req, res) => {
        sqlfunctions.ContactUs(req)
    })

app.post(
    '/api/buyItem', (req, res) => {
        sqlfunctions.BuyItem(req)
    }
)
