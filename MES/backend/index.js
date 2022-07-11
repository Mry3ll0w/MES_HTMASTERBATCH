const express = require('express');
const app = express();
const sql = require('mssql')
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('body-parser');
const async = require('async');
const fs = require('fs');//Lectura de archivos para leer sql queries
app.listen('4001',() => {console.log('listening in 4001')});
//usando bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());//Permitir coger la info del front end como json
app.use(cors());
// DB credentials
const config = {
    user: 'WEBAPI',
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
        //console.log('Connected to database');

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
        
        return { query: result.recordset, ok : true};
    }
    catch (err) {
        console.log(`Error querying database, query usada ${q}`, err);

        //return {query :err, ok : false};
    }
        DB.close();
}

async function execute() {
    let result = await get_query("select top 10 * from Datos19.dbo.Tb19");
    console.dir(JSON.stringify(result));

    return result;
}

app.get('/RegEnsacado', (request, res) => {

    async function query(){

        let q_ensacados= await get_query("select * from MES.dbo.tbRegEnsacado");
        var sql_q = fs.readFileSync('Q_Lista_productos.sql').toString();
        let q_prods = await get_query(fs.readFileSync('Q_Lista_productos.sql').toString());
        if (q_ensacados.ok && q_prods.ok) res.send({Productos : q_prods.query , Ensacados : q_ensacados.query});
        else res.send("Fallo al hacer la query");
        //console.log(q_ensacados)

    }
    query();
});

app.post('/UpdateEnsacado', (request, res) =>{
    console.log(request.body);
    async function q (){
        var q_ins = await get_query(`Update MES.dbo.tbRegEnsacado SET Fecha = '${request.body.Fecha}' , Turno ='${request.body.Turno}', Producto ='${request.body.Producto}', Palet = '${request.body.Palet}', Peso_Saco=${request.body.Peso_Saco},Cantidad = ${request.body.Cantidad}, Resto = '${request.body.Resto}', Ant = ${request.body.Ant} WHERE Palet = '${request.body.PaletOriginal}';`)
        console.log(q_ins);
    }
    q();
});

app.post('/RegistraEnsacado', (request, res) =>{
    console.log(request.body);
    const E = request.body;
    async function q (){
        var q_ins = await get_query(`INSERT INTO MES.dbo.tbRegEnsacado (Fecha, Turno, Producto, Palet, Peso_Saco,Cantidad, Resto, Ant) 
        VALUES('${E.Fecha}','${E.Turno}', '${E.Producto}','${E.Palet}', ${E.Peso_Saco},${E.Cantidad},'${E.Resto}',${E.Ant});`)
        console.log(q_ins);
    }
    q();
});

app.post('/DelEns', (request, res) =>{
    console.log(request.body);
    const E = request.body;
    async function q(){
        var q_ins = await get_query(`DELETE FROM MES.dbo.tbRegEnsacado WHERE Fecha='${E.Fecha}' AND Palet='${E.Palet}' AND Turno='${E.Turno}';`)
        console.log(q_ins);
    }
    q();
});

//Estadistico

app.get('/dataEstadistico',(request, res)=>{
    async function query(){

        //Lista de Productos
        var sql_q = fs.readFileSync('Q_Lista_productos.sql').toString();
        let q_prods = await get_query(sql_q);
        
        //Lista de Tendencias
        
        //Lista de OFS


        //console.log(q_ensacados)

    }
    query();
});
