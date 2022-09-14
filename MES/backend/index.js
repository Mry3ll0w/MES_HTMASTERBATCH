const express = require('express');
const app = express();
const sql = require('mssql')
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('body-parser');
const async = require('async');
const fs = require('fs');//Lectura de archivos para leer sql queries

var bcrypt = require('bcryptjs');
const { get } = require('http');
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



app.get('/RegEnsacado', (request, res) => {

    async function query(){

        let q_ensacados= await get_query("select * from MES.dbo.tbRegEnsacado order by Fecha asc");
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
        var q_ins = await get_query(`Update MES.dbo.tbRegEnsacado SET Fecha = '${request.body.Fecha}' , Turno ='${request.body.Turno}', Producto ='${request.body.Producto}', Palet = '${request.body.Palet}', Peso_Saco='${request.body.Peso_Saco}',Cantidad = ${request.body.Cantidad}, Resto = '${request.body.Resto}', Ant = ${request.body.Ant}, Observaciones = '${request.body.Observaciones}' WHERE ID = ${request.body.ID};`)
        console.log(q_ins);
    }
    q();
});

app.post('/RegistraEnsacado', (request, res) =>{
    console.log(request.body);
    const E = request.body;
    async function q (){
        var q_ins = await get_query(`INSERT INTO MES.dbo.tbRegEnsacado (Fecha, Turno, Producto, Palet, Peso_Saco,Cantidad, Resto, Ant, iniciales, Observaciones) 
        VALUES('${E.Fecha}','${E.Turno}', '${E.Producto}','${E.Palet}', '${E.Peso_Saco}',${E.Cantidad},'${E.Resto}',${E.Ant},'${E.iniciales}', '${E.Observaciones}');`)
        console.log(q_ins);
    }
    q();
});

app.post('/DelEns', (request, res) =>{
    console.log(request.body);
    const E = request.body;
    async function q(){
        var q_ins = await get_query(`DELETE FROM MES.dbo.tbRegEnsacado WHERE ID = ${E.ID};`)
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
    
    var query;
    var q_cal;
    var l_inf = request.body.Lim_Inf
    var l_sup = request.body.Lim_Sup

    console.log(`Limite INFERIOR: ${l_inf}`)
    console.log(`Limite Sup: ${l_sup}`)
    console.table(request.body)
    
    if(request.body.Tendencia == '19'){
        query =`
        Select * from Datos19.dbo.tb19
        WHere
            valor > 100
            AND
            FechaHora BETWEEN '${l_inf}' AND '${l_sup}'
        order by FechaHora desc;`
        
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
            Select Valor,FechaHora from Datos${request.body.Tendencia}.dbo.tb${request.body.Tendencia} 
            WHERE 
            FechaHora Between '${request.body.Lim_Inf}' AND '${request.body.Lim_Sup}'
            and valor > 0
            and FechaHora not IN (
                Select FechaHora
                from Datos19.dbo.Tb19
            WHERE 
                Valor < 101
                AND 
                FechaHora BETWEEN '${l_inf}' and '${l_sup}'
            )
            order by FechaHora desc;
            `
        
        q_cal = `select AVG(Valor) as media, MAX(Valor) as max, MIN(Valor) as min from Datos${request.body.Tendencia}.dbo.Tb${request.body.Tendencia} 
            WHERE FechaHora Between '${request.body.Lim_Inf}' AND '${request.body.Lim_Sup}'
            and Valor > 0
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
        
        var datos_calculados= await get_query(query);
        var media_min_max = await get_query(q_cal)
        console.log(media_min_max.query)
        
        res.send({Datos_Calculados : datos_calculados.query, Resultado: media_min_max.query })
    }
    q();
})

//LOGIN FORM
    
app.get('/Login', (request,res)=>{
    
    //const salt = bcrypt.genSaltSync(10)
    //console.log(`pwd : ${bcrypt.hashSync('1234',salt)}`)
    
    async function f (){
        var query = 'select Codigo,Pwd_Hashed,Nombre,Apellidos from WEB_API_TABLES.dbo.tbEmpleados WHERE Pwd_Hashed is not NULL and ContratoEstadoID = 1;'
        var resultado = await get_query(query);
        //console.log(resultado)
        res.send({user : resultado.query})
    }
    
    
    f()
    
});

app.get('/Profile/:user',(request,res)=>{
    var user = request.params.user;
    async function f(){
        var query = `select * from WEB_API_TABLES.dbo.tbEmpleados where Codigo = '${user}';`
        var resultado = await get_query(query);
        console.log(resultado.query)
        res.send({user : resultado.query})
    }
    f();
})

app.post('/Profile',(request,res)=>{
    var Codigo = request.body.Codigo;
    var Pwd_Hashed = request.body.NewPass;
    async function f(){
        var query = `update WEB_API_TABLES.dbo.tbEmpleados set Pwd_Hashed = '${Pwd_Hashed}' where Codigo = '${Codigo}';`
        var resultado = await get_query(query);
        console.log(resultado)
        //res.send({user : resultado.query})
    }
    f();
})


//*Registro de Planta
app.get('/RegPlanta',(request,res)=>{
    async function f(){
        
        var resultado = await get_query(fs.readFileSync('OF_UNIDAS.sql').toString());
        //console.log(resultado)
        res.send({Datos : resultado.query})
    }
    f();
});

app.post('/RegPlanta',(request,res)=>{
    console.log(request.body)
    async function f ()  {
        var query = `
        use MES; 
        Select 
            *
        from tbRegPlanta
        WHERE OrdenFabricacionID = '${request.body.OF}'
        
        `
        var resultado_planta = await get_query(query);
        
        var q_comun = `
            use MES;
            Select * from tbRegPlantaComun
            WHERE OrdenFabricacionID = '${request.body.OF}'
        `
        var resultado_comun = await get_query(q_comun)

        //UNA VEZ OBTENIDO LOS ELEMENTOS DE REGPLANTACOMUN => SACAMOS LA OF PARA CALCULO DE RESUMEN
        console.log(resultado_comun.query[0].OrdenFabricacionID)
        var q_resultado_resumen = `
        use MES;
        select 
            Sum(COALESCE(ArrS1,0)) - Sum(COALESCE(RetS1,0)) as S1,
            Sum(COALESCE(ArrBB1,0)) - SUM(COALESCE(RetBB1,0)) as BB1,
            SUM(COALESCE(ArrBB2, 0)) - Sum(COALESCE(RetBB2,0)) as BB2,
            SUM(COALESCE(ARRSG1,0)) - SUM(COALESCE(RetSG1,0)) as SG1,
            SUM(COALESCE(ARRSP2,0)) - SUM(ISNULL(RetSP2,0)) as SP2,
            SUM(ISNULL(ARRSP3,0)) - SUM(ISNULL(RetSP3,0)) AS SP3,
            SUM(ISNULL(ArrBB3,0)) - SUM(ISNULL(RetBB3,0)) AS BB3,
            SUM(ISNULL(ArrBB4,0)) - SUM(ISNULL(RetBB4,0)) AS BB4,
            SUM(ISNULL(ArrBB5,0)) - SUM(ISNULL(RetBB5,0)) AS BB5,
            SUM(ISNULL(ArrLIQ,0)) - SUM(ISNULL(RetLIQ,0)) AS LIQ,
            SUM(ISNULL(ArrL2,0)) -SUM(ISNULL(RETL2,0)) AS L2,
            SUM(ISNULL(ArrL3,0)) - SUM(ISNULL(RetL3,0)) AS L3

        from 
            tbRegPlanta
        where 
            OrdenFabricacionID = '${resultado_comun.query[0].OrdenFabricacionID}'
        `
        var resultado_resumen = await get_query(q_resultado_resumen)
        console.log(resultado_resumen.query[0])

        //Calculamos los datos del resumen
        var query_resumen_total = `use MES;

        DECLARE @S_Ensacado FLOAT;
        SET @S_Ensacado = ISNULL((
            SELECT SUM(ENSACADO) as Ensacado
            FROM tbRegPlanta
            WHERE OrdenFabricacionID = '${request.body.OF}'
            and ObjetoID <> 12 
        ),0);
        
        DECLARE @V_Plasta FLOAT;
        SET @V_Plasta = ISNULL(
            (
                SELECT top 1
            Plasta
            from
                tbRegPlanta
            where 
                    OrdenFabricacionID = '${request.body.OF}'
            
                )
        ,0);
            
            
        /*
        Para hacer mas limpia la consulta y poder corregir el caso de no tener valor en la consulta, hago las consultas a parte
            
        */
        DECLARE @A_PRODUCCION FLOAT;
        SET @A_PRODUCCION = ISNULL( (select
            Produccion
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${request.body.OF}'
            and
            ObjetoID = 12),0);
        
        DECLARE @A_SELECCION FLOAT;
        SET @A_SELECCION = ISNULL((select
            Seleccion
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${request.body.OF}'
            and
            ObjetoID = 12) ,0);
        
        DECLARE @A_RECHAZO FLOAT;
        SET @A_RECHAZO = ISNULL((select
            Rechazo
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${request.body.OF}'
            and
            ObjetoID = 12) ,0);
        
        DECLARE @A_ENSACADO FLOAT;
        SET @A_ENSACADO = ISNULL( (
            select
            Ensacado
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${request.body.OF}'
            and
            ObjetoID = 12
        ),0);
        
        DECLARE @A_RECHAZOTA FLOAT;
        SET @A_RECHAZOTA = ISNULL( (select
            RechazoTA
        from
            tbRegPlanta
        where 
            OrdenFabricacionID = '${request.body.OF}'
            and
            ObjetoID = 12),0);
        
        DECLARE @A_DESPERDICIO FLOAT;
        SET @A_DESPERDICIO = ISNULL((select
            Desperdicio
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${request.body.OF}'
            and
            ObjetoID = 12),0);
        
        DECLARE @ENSACADO_DEF FLOAT;
        SET @ENSACADO_DEF = @S_Ensacado + @A_ENSACADO;
        
        SELECT
            COALESCE(ISNULL(t1.Produccion,0) + ISNULL(@A_PRODUCCION,0),0) as Produccion,
            ISNULL(t1.Seleccion,0) + ISNULL(@A_SELECCION,0) as Seleccion,
            ISNULL(t1.Rechazo,0) + ISNULL(@A_RECHAZO,0) as Rechazo,
            @ENSACADO_DEF as Ensacado,
            ISNULL(t1.RechazoTA,0) + ISNULL(@A_RECHAZOTA,0) as RechazoTA,
            ISNULL(t1.Desperdicio,0) + ISNULL(@A_DESPERDICIO,0) as Desperdicio,
            ISNULL(@V_Plasta,0) as Plasta,
            (ISNULL(t1.Seleccion,0) + ISNULL(@A_SELECCION,0) - @ENSACADO_DEF) as Sel_Ens
        
        from
            (
                select top 1
                Produccion ,
                Seleccion ,
                Rechazo ,
            
                RechazoTA,
                Desperdicio,
                Plasta
            from
                tbRegPlanta as O
            where 
                    OrdenFabricacionID = '${request.body.OF}'
                and
                ObjetoID = 2
            order by FechaHoraReg desc
            )t1
            
        ;
`
        var resultado_query_resumen_total = await get_query(query_resumen_total)
        //console.log(resultado_query_resumen_total.query[0])
        //console.log(resultado_planta.query)
        res.send({DatosRegPlanta : resultado_planta.query , DatosRegPlantaComun : resultado_comun.query, Resumen: resultado_resumen.query[0], ResumenTotal : resultado_query_resumen_total.query[0]})
    }
    f();
    
})

app.get('/RegPlanta', (request, res) => {
    

})