const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_Host,
    user:process.env.DB_User,
    password: process.env.DB_password,
    database: process.env.DB_Name,
});

connection.connect((err) => {
    if(err){
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = connection;