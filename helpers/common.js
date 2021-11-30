//writing csv

exports.writeCSV = function (data) {
    const fs = require('fs')

    let str = '';
    let header = Object.keys(data[0]);
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
    fs.writeFile('./../messeges.csv', str, err => {
        if (err) {
            console.error(err)
            return
        }
    })
}
