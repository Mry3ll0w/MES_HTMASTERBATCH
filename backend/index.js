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
const { Console } = require('console');
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

const config_ecisa = {
    user: 'report',
    password: process.env.htm_ecisa_auth,
    server: `ECIESA\\WINCC`,
    database: 'master',
    options: {
        trustServerCertificate: true //Hace falta para que podamos acceder al servidor
    }
}

//Se que es redundante tener 2 funciones exactamente iguales, pero quiero distinguirlas de cara al uso con 
//cada uno de los servidores

async function connectECIESA() {
    const pool = new sql.ConnectionPool(config_ecisa);
    
    try {
        await pool.connect();
        return pool;
    }
    catch(err) {
        console.table("NOMBRE SERVIDOR: "+ config_ecisa.server)
        console.log('Database connection failed!', err);
        return err;
    }
}

async function query_ECIESA(q) {
    const DB = await connectECIESA();

    try {
        const result = await DB.request()
            .query(q);
        
        return { query: result.recordset, ok : true};
    }
    catch (err) {
        console.log(`Error querying database, used query ${q}`, err);
    }
        DB.close();
}

//QUERYS PARA MES
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


async function MES_query(q) {
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

        let q_ensacados= await MES_query("select * from MES.dbo.TablaAuxiliar4 order by Fecha desc");
        let q_prods = await MES_query(fs.readFileSync('Q_Lista_productos.sql').toString());
        if (q_ensacados.ok && q_prods.ok) res.send({Productos : q_prods.query , Ensacados : q_ensacados.query});
        else res.send("Fallo al hacer la query");
        //console.log(q_ensacados)

    }
    query();
});

app.post('/UpdateEnsacado', (request, res) =>{
    console.log(request.body);
    async function q (){
        var q_ins = await MES_query(`Update MES.dbo.TablaAuxiliar4 SET Fecha = '${request.body.Fecha}' , Turno ='${request.body.Turno}', Producto ='${request.body.Producto}', Palet = '${request.body.Palet}', Peso_Saco='${request.body.Peso_Saco}',Cantidad = ${request.body.Cantidad}, Resto = '${request.body.Resto}', Ant = ${request.body.Ant}, Observaciones = '${request.body.Observaciones}' WHERE ID = ${request.body.ID};`)
        console.log(q_ins);
    }
    q();
});

app.post('/RegistraEnsacado', (request, res) =>{
    console.log(request.body);
    const E = request.body;
    async function q (){
        var q_ins = await MES_query(`INSERT INTO MES.dbo.TablaAuxiliar4 (Fecha, Turno, Producto, Palet, Peso_Saco,Cantidad, Resto, Ant, iniciales, Observaciones) 
        VALUES('${E.Fecha}','${E.Turno}', '${E.Producto}','${E.Palet}', '${E.Peso_Saco}',${E.Cantidad},'${E.Resto}',${E.Ant},'${E.iniciales}', '${E.Observaciones}');`)
        console.log(q_ins);
    }
    q();
});

app.post('/DelEns', (request, res) =>{
    console.log(request.body);
    const E = request.body;
    async function q(){
        var q_ins = await MES_query(`DELETE FROM MES.dbo.TablaAuxiliar4 WHERE ID = ${E.ID};`)
        console.log(q_ins);
    }
    q();
});

//Estadistico

app.get('/dataEstadistico',(request, res)=>{
    async function query(){

        //Lista de Productos
        var sql_q = fs.readFileSync('Q_Lista_productos.sql').toString();
        let q_prods = await MES_query(sql_q);
        
        //Lista de Tendencias
        var sql_tendecias= await MES_query(fs.readFileSync('Q_Get_TotalTendencias.sql').toString());
        //Lista de OFS
        var q_OFS = await MES_query(fs.readFileSync('OF_PROD_Fechas.sql').toString());

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
        
        var datos_calculados= await MES_query(query);
        var media_min_max = await MES_query(q_cal)
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
        var resultado = await MES_query(query);
        //console.log(resultado)
        res.send({user : resultado.query})
    }
    
    
    f()
    
});

app.get('/Profile/:user',(request,res)=>{
    var user = request.params.user;
    async function f(){
        var query = `select * from WEB_API_TABLES.dbo.tbEmpleados where Codigo = '${user}';`
        var resultado = await MES_query(query);
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
        var resultado = await MES_query(query);
        console.log(resultado)
        //res.send({user : resultado.query})
    }
    f();
})


//*Registro de Planta
app.get('/RegPlanta',(request,res)=>{
    async function f(){
        
        var resultado = await MES_query(fs.readFileSync('OF_UNIDAS.sql').toString());
        //console.log(resultado)
        res.send({Datos : resultado.query})
    }
    f();
});

/**
----------------------------------------REGISTRO DE PLANTA -----------------------------------------
*/
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
        var resultado_planta = await MES_query(query);
        
        var q_comun = `
            use MES;
            Select * from tbRegPlantaComun
            WHERE OrdenFabricacionID = '${request.body.OF}'
        `
        var resultado_comun = await MES_query(q_comun)
        
        //UNA VEZ OBTENIDO LOS ELEMENTOS DE REGPLANTACOMUN => SACAMOS LA OF PARA CALCULO DE RESUMEN
        
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
            OrdenFabricacionID = '${request.body.OF}'
        `
        var resultado_resumen = await MES_query(q_resultado_resumen)
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
        var q_eciesa_derecha = `
        use HTM;
        SELECT 
        Componente, Lote, Linea, Ubicacion, 
        Sum(Cantidad) AS CantidadTotal
        FROM Tabla_PESADAS
        WHERE
            OrdenFabricacion = '${request.body.OF}'
        GROUP BY OrdenFabricacion, Componente, Lote, Linea, Ubicacion;

        `
        /*
        try{
            var resultado_eciesa_derecha = await MES_query_ECIESA(q_eciesa_derecha) 
            console.table(resultado_eciesa_derecha.query)  
        }
        catch{
            console.debug("FALLA LA CONSULTA DE ECIESA")
        }
        */
        var resultado_query_resumen_total = await MES_query(query_resumen_total)
        res.send({DatosRegPlanta : resultado_planta.query , DatosRegPlantaComun : resultado_comun.query, Resumen: resultado_resumen.query[0], ResumenTotal : resultado_query_resumen_total.query[0]})
    }
    f();
    
})




app.get('/AdmUsers', (request, reply) => {
    async function f(){
        var q_usuarios = `
        use WEB_API_TABLES;
        SELECT 
            ID, Codigo,
            Apellidos,
            Nombre,
            TratamientoID,
            Alias,
            CargoID,
            ContratoEstadoID
        FROM 
            tbEmpleados
        Where
            Codigo <> 'E###'
        ;`

        let res_usuarios = await MES_query(q_usuarios);
        
        var q_last_code = `
        use WEB_API_TABLES;
        SELECT top 1
             Codigo
            
        FROM 
            tbEmpleados
        WHERE
            ID <> '2062' /*Esa ID corresponde a un temporal*/
        order by ID desc;
        `
        let res_last_code = await MES_query(q_last_code)
        var str_cod = String(res_last_code.query[0].Codigo)
        var [trash,numero] = str_cod.split('E')
        
        reply.send({Usuarios : res_usuarios.query, NextCode: `E${parseInt(numero)+1}`})
    }

    f();
})

app.post('/UpdateAdmUsers', (request, reply) => {
    console.log(request.body.Usuario)
    async function f(){
        const User = request.body.Usuario
        var q_update_user = `
        use WEB_API_TABLES;
        UPDATE
        tbEmpleados
            SET 
                Codigo = '${User.Codigo}', Nombre = '${User.Nombre}',
                Apellidos = '${User.Apellidos}', TratamientoID = ${User.TratamientoID},
                Alias = '${User.Alias}', CargoID = ${User.CargoID}, ContratoEstadoID = ${User.ContratoEstadoID}
        WHERE
            ID = ${User.ID}
        `
        var res_Update = await MES_query(q_update_user);
        
    }
f();
})

app.post('/NewAdmUsers', (request, reply)=>{
    console.log(request.body)
    async function f() {
        //Tratamos el alias
        var [ap1,ap2] = request.body.Apellidos.split(' ');
        var alias = request.body.Nombre[0] + ap1[0]+ap2[0]
        console.log(`ALIAS :${alias}`)
        var q_insercion = `
        use WEB_API_TABLES;
        INSERT INTO tbEmpleados (Codigo,Apellidos,Nombre,TratamientoID,CargoID,ContratoEstadoID)
        VALUES('${request.body.Codigo}', '${request.body.Apellidos}','${request.body.Nombre}',
        ${request.body.TratamientoID}, ${request.body.CargoID}, ${request.body.ContratoEstadoID}
        )
        ` 
        let res_insercion = await MES_query(q_insercion);

    }
f()

});

app.post('/EraseAdmUsers', (request, reply) => {
    async function f(){
        var erase = await MES_query(`USE WEB_API_TABLES; DELETE FROM tbEmpleados WHERE ID = ${request.body.ID}`)
    }
f();
})


app.get('/RegistroPlanta/Trazabilidad/:OF', (request, res) => {
    
    async function f (){
        
        var OF = request.params.OF;
        var q_get_trace_data = `
        use MES;
        SELECT
            Fecha, Turno, Producto,ID,
            Palet, Cantidad, Resto, [OF]
        from TablaAuxiliar4
        where
            [OF] = '${OF}'
        ;
        ` 
        var q_resultado_resumen = `
        use MES;

        DECLARE @S_Ensacado FLOAT;
        SET @S_Ensacado = ISNULL((
            SELECT SUM(ENSACADO) as Ensacado
            FROM tbRegPlanta
            WHERE OrdenFabricacionID = '${OF}'
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
                    OrdenFabricacionID = '${OF}'
            
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
                OrdenFabricacionID = '${OF}'
            and
            ObjetoID = 12),0);
        
        DECLARE @A_SELECCION FLOAT;
        SET @A_SELECCION = ISNULL((select
            Seleccion
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${OF}'
            and
            ObjetoID = 12) ,0);
        
        DECLARE @A_RECHAZO FLOAT;
        SET @A_RECHAZO = ISNULL((select
            Rechazo
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${OF}'
            and
            ObjetoID = 12) ,0);
        
        DECLARE @A_ENSACADO FLOAT;
        SET @A_ENSACADO = ISNULL( (
            select
            Ensacado
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${OF}'
            and
            ObjetoID = 12
        ),0);
        
        DECLARE @A_RECHAZOTA FLOAT;
        SET @A_RECHAZOTA = ISNULL( (select
            RechazoTA
        from
            tbRegPlanta
        where 
            OrdenFabricacionID = '${OF}'
            and
            ObjetoID = 12),0);
        
        DECLARE @A_DESPERDICIO FLOAT;
        SET @A_DESPERDICIO = ISNULL((select
            Desperdicio
        from
            tbRegPlanta
        where 
                OrdenFabricacionID = '${OF}'
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
                    OrdenFabricacionID = '${OF}'
                and
                ObjetoID = 2
            order by FechaHoraReg desc
            )t1
            
        ;
        `
        var q_fechas = `
        use MES;
        SELECT 
            FechaInicio, FechaFin,ProductoID,Observaciones
        from 
            tbRegPlantaComun
        WHERE
            OrdenFabricacionID = '${OF}'
        `
        try{

            var resultado_resumen = await MES_query(q_resultado_resumen)
            var resultado_fechas = await MES_query(q_fechas);
            var res_trace_data = await MES_query(q_get_trace_data);
            res.send({
                Trazabilidad : res_trace_data.query,
                DatosResumen : resultado_resumen.query[0],
                Fechas: resultado_fechas.query[0]
            })
        }
        catch{
            console.log("Falla la lectura de la trazabilidad")
        }
        
    }
    f()
})

app.post('/RegistroPlanta/UpdateTrazabilidad', (request, reply) => {
    async function f(){
        const T = request.body.Trazabilidad;
        var q_update = `
            use MES;
                Update TablaAuxiliar4
                    SET 
                        Cantidad = ${T.Cantidad},
                        Resto = '${T.Resto}'
                where
                    ID = ${T.ID}
        `
        await MES_query(q_update);

    }
f();
})