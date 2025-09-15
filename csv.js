//csv.js

//imports
const fs = require('fs');
const path = require('path')
const csvParser = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const { title } = require('process');

const csvFilePath = path.join(__dirname, 'users.csv');

function getUsers() {
    return new Promise((res, rej) => {
        const users = [];
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (row) => users.push(row))
            .on('end', () => res(users))
            .on('error', rej);
    });
}

function addUser(user) {
    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
            {id: 'username', title: 'username'},
            {id: 'password', title: 'password'}
        ],
        append: fs.existsSync(csvFilePath)
    });
    return csvWriter.writeRecords([user])
}

module.exports = { getUsers, addUser };