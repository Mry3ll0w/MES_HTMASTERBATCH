const express = require('express');
const app = express();
const sql = require('mssql')

app.listen('3001',() => {console.log('listening in 3001')});

// DB credentials
const config = {
    user: 'sa',
    password: process.env.htm_auth,
    server: 'marketing',
    database: 'master',
    options: {
        trustServerCertificate: true //Hace falta para que podamos acceder al servidor
    }
}

async function connectDB() {
    const pool = new sql.ConnectionPool(config);

    try {
        await pool.connect();
        console.log('Connected to database');

        return pool;
    }
    catch(err) {
        console.log('Database connection failed!', err);

        return err;
    }
}

async function get_query(q) {
    const DB = await connectDB();

    try {
        const result = await DB.request()
            .query(q);

        return result.recordset;
    }
    catch (err) {
        console.log(`Error querying database, query usada ${q}`, err);

        return err;
    }
    finally {
        DB.close();
    }
}

async function execute() {
    let result = await get_query("select top 10 * from Datos19.dbo.Tb19");
    console.dir(JSON.stringify(result));

    return result;
}

execute();