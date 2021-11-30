const { db } = require('./../server');
// const commonFunctions = require('./common.js')

exports.ContactUs = function (req) {
    let fullname = req.body["name"];
    let email = req.body["email"];
    let message = req.body["message"];
    let subscribed = req.body["subscribed"];
    let selected = req.body["selected"];


    let contactList = [];
    const myPromise = new Promise((resolve, reject) => {

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

    });

    myPromise.then(
        (list) => {

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
        (data) => {
            //writing data in csv file
            const fs = require('fs')
            let str = '';
            let header = Object.keys(data[0]);

            //checkin if there is comma in the message, because csv file cant understand comma, it is understandin like new calomn

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
            console.log(833,str)
            fs.writeFile('./messeges.csv', str, err => {
                
                if (err) {
                    console.error(err)
                    return
                }
                console.log("writen")
            })
        }
    )
}
