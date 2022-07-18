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
        var sql_tendecias= await get_query(fs.readFileSync('Q_Get_TotalTendencias.sql').toString());
        //Lista de OFS
        var q_OFS = await get_query(fs.readFileSync('OF_PROD_Fechas.sql').toString());

        //console.log(q_ensacados)
        res.send({Productos : q_prods.query, Tendencias : sql_tendecias.query, OFS : q_OFS.query})
    }
    query();
});

app.post('/calcEstadistico',(request,res)=>{
    //console.log(request.body);
    var query;
    var q_cal;
    var l_inf = request.body.Lim_Inf
    var l_sup = request.body.Lim_Sup

    if(request.body.Tendencia == '19'){
        query = `Select Valor,FechaHora from Datos19.dbo.Tb19 WHERE Valor > 101 AND FechaHora Between '${request.body.Lim_Inf}' AND '${request.body.Lim_Sup}'`
        q_cal = `
            Select AVG(valor) as media, MAX(VALOR) as max, MIN(VALOR) as min
            from Datos19.dbo.Tb19
            WHERE 
                Valor > 101
                AND 
                FechaHora BETWEEN '${l_inf}' and '${l_sup}'
            `
    }
    else{
        query = `
            Select Valor,FechaHora from Datos${request.body.Tendencia}.dbo.tb${request.body.Tendencia} WHERE FechaHora Between '${request.body.Lim_Inf}' AND '${request.body.Lim_Sup}'
            and FechaHora not IN (
                Select FechaHora
                from Datos19.dbo.Tb19
            WHERE 
                Valor < 101
                AND 
                FechaHora BETWEEN '${l_inf}' and '${l_sup}'
            );
            `
        
        q_cal = `select AVG(Valor) as media, MAX(Valor) as max, MIN(Valor) as min from Datos${request.body.Tendencia}.dbo.Tb${request.body.Tendencia} 
            WHERE FechaHora Between '${request.body.Lim_Inf}' AND '${request.body.Lim_Sup}'
            and FechaHora not IN (
                Select FechaHora
                from Datos19.dbo.Tb19
                WHERE 
                    Valor < 101
                    AND 
                    FechaHora BETWEEN '${l_inf}' and '${l_sup}'
        );`
    }
    
    async function q(){
        console.log(query)

        var datos_calculados= await get_query(query);
        var media_min_max = await get_query(q_cal)
        console.log(media_min_max.query)
        res.send({Datos_Calculados : datos_calculados.query, Resultado: media_min_max.query })
    }
    q();
})
