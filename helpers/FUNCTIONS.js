let ShopProductsjs = require('./ShopProducts.js')

exports.ShopProducts = function (res) {
    ShopProductsjs.ShopProducts(res)
}
//________________________________________________________

let ProductsByCategoryjs = require('./ProductsByCategory.js')

exports.ProductsByCategory = function (name, res) {
    ProductsByCategoryjs.ProductsByCategory(name, res)
}
//________________________________________________________

let CheckUsersjs = require('./CheckUsers.js') 

exports.CheckUser = function (username, password, res) {
    CheckUsersjs.CheckUser(username, password, res)
}
//________________________________________________________

let GiveProductsByIdjs = require('./GiveProductsById.js');
exports.GiveProductsById = function (id, res) {
    GiveProductsByIdjs.GiveProductsById(id, res)
}
//________________________________________________________

let ADDtoCARTjs = require('./ADDtoCART.js')

exports.ADDtoCART = function (id, userId) {
    ADDtoCARTjs.ADDtoCART(id,userId)
}

//________________________________________________________

let Updatejs =  require('./Update.js')
exports.Update = function (array) {
    Updatejs.Update(array)
}

//________________________________________________________

let Registrationjs = require('./Registration.js')
exports.Registration = function (req, res) {
    Registrationjs.Registration(req,res)
   
}
//________________________________________________________

let ContactUsjs = require('./ContactUs.js')
exports.ContactUs = function (req) {
    ContactUsjs.ContactUs(req)
}
//________________________________________________________

let BuyItemjs = require('./BuyItem.js')

exports.BuyItem = function (req) {
    BuyItemjs.BuyItem(req)
}

//________________________________________________________
