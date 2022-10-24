const express = require("express");
const app = express();
const sql = require("mssql");
const bodyParser = require("body-parser");
const cors = require("cors");
const { json } = require("body-parser");
const async = require("async");
const fs = require("fs"); //Lectura de archivos para leer sql queries

var bcrypt = require("bcryptjs");
const { get, request } = require("http");
const { Console } = require("console");
app.listen("4001", () => {
  console.log("listening in 4001");
});
//usando bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); //Permitir coger la info del front end como json
app.use(cors());
// DB credentials
const config = {
  user: "WEBAPI",
  password: process.env.htm_auth,
  server: "marketing",
  database: "master",
  options: {
    trustServerCertificate: true, //Hace falta para que podamos acceder al servidor
  },
};

const config_ecisa = {
  user: "report",
  password: process.env.htm_ecisa_auth,
  server: `ECIESA\\WINCC`,
  database: "master",
  options: {
    trustServerCertificate: true, //Hace falta para que podamos acceder al servidor
  },
};

//Se que es redundante tener 2 funciones exactamente iguales, pero quiero distinguirlas de cara al uso con
//cada uno de los servidores

async function connectECIESA() {
  const pool = new sql.ConnectionPool(config_ecisa);

  try {
    await pool.connect();
    return pool;
  } catch (err) {
    console.table("NOMBRE SERVIDOR: " + config_ecisa.server);
    console.log("Database connection failed!", err);
    return err;
  }
}

async function query_ECIESA(q) {
  const DB = await connectECIESA();

  try {
    const result = await DB.request().query(q);

    return { query: result.recordset };
  } catch (err) {
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
  } catch (err) {
    console.log("Database connection failed!", err);
    return err;
  }
}

async function MES_query(q) {
  const DB = await connectDB();

  try {
    const result = await DB.request().query(q);

    return { query: result.recordset };
  } catch (err) {
    console.log(`Error querying database, query usada ${q}`, err);

    //return {query :err, ok : false};
  }
  DB.close();
}

app.get("/RegEnsacado", (request, res) => {
  async function query() {
    try {
      let q_ensacados = await MES_query(
        "select * from [WEB_API_TABLES].[dbo].[RegistroEnsacado] order by Fecha desc"
      );
      let q_prods = await MES_query(
        fs.readFileSync("Q_Lista_productos.sql").toString()
      );

      res.send({ Productos: q_prods.query, Ensacados: q_ensacados.query });
    } catch {
      res.send("Fallo al hacer la query");
    }
  }
  query();
});

app.post("/UpdateEnsacado", (request, res) => {
  console.log(request.body);
  async function q() {
    var q_ins = await MES_query(
      `Update [WEB_API_TABLES].[dbo].[RegistroEnsacado] SET Fecha = '${request.body.Fecha}' , 
      Turno ='${request.body.Turno}', Producto ='${request.body.Producto}', 
      Palet = '${request.body.Palet}', Peso_Saco='${request.body.Peso_Saco}',
      Cantidad = ${request.body.Cantidad}, Resto = '${request.body.Resto}', 
      Ant = ${request.body.Ant}, Observaciones = '${request.body.Observaciones}' WHERE ID = ${request.body.ID};`
    );
    console.log(q_ins);
  }
  q();
});

app.post("/RegistraEnsacado", (request, res) => {
  console.log(request.body);
  const E = request.body;
  async function q() {
    var q_ins =
      await MES_query(`INSERT INTO [WEB_API_TABLES].[dbo].[RegistroEnsacado] (Fecha, Turno, Producto, Palet, Peso_Saco,Cantidad, Resto, Ant, iniciales, Observaciones) 
        VALUES('${E.Fecha}','${E.Turno}', '${E.Producto}','${E.Palet}', '${E.Peso_Saco}',${E.Cantidad},'${E.Resto}',${E.Ant},'${E.iniciales}', '${E.Observaciones}');`);
    console.log(q_ins);
  }
  q();
});

app.post("/DelEns", (request, res) => {
  console.log(request.body);
  const E = request.body;
  async function q() {
    var q_ins = await MES_query(
      `DELETE FROM [WEB_API_TABLES].[dbo].[RegistroEnsacado] WHERE ID = ${E.ID};`
    );
    console.log(q_ins);
  }
  q();
});

//Estadistico

app.get("/dataEstadistico", (request, res) => {
  async function query() {
    //Lista de Productos
    var sql_q = fs.readFileSync("Q_Lista_productos.sql").toString();
    let q_prods = await MES_query(sql_q);

    //Lista de Tendencias
    var sql_tendecias = await MES_query(
      fs.readFileSync("Q_Get_TotalTendencias.sql").toString()
    );
    //Lista de OFS
    var q_OFS = await MES_query(
      fs.readFileSync("OF_PROD_Fechas.sql").toString()
    );

    //console.log(q_ensacados)
    res.send({
      Productos: q_prods.query,
      Tendencias: sql_tendecias.query,
      OFS: q_OFS.query,
    });
  }
  query();
});

app.post("/calcEstadistico", (request, res) => {
  var query;
  var q_cal;
  var l_inf = request.body.Lim_Inf;
  var l_sup = request.body.Lim_Sup;

  if (request.body.Tendencia == "19") {
    query = `
        Select * from Datos19.dbo.tb19
        WHere
            valor > 100
            AND
            FechaHora BETWEEN '${l_inf}' AND '${l_sup}'
        order by FechaHora desc;`;

    q_cal = `
            Select AVG(valor) as media, MAX(VALOR) as max, MIN(VALOR) as min
            from Datos19.dbo.Tb19
            WHERE 
                Valor > 101
                AND 
                FechaHora BETWEEN '${l_inf}' and '${l_sup}'
            `;
  } else {
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
            `;

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
        );`;
  }

  async function q() {
    try {
      var datos_calculados = await MES_query(query);
      var media_min_max = await MES_query(q_cal);
      console.log(media_min_max.query);
      res.send({
        Datos_Calculados: datos_calculados.query,
        Resultado: media_min_max.query,
      });
    } catch {
      console.log("Error calculo en estadistico");
    }
  }
  q();
});

//LOGIN FORM

app.get("/Login", (request, res) => {
  //const salt = bcrypt.genSaltSync(10)
  //console.log(`pwd : ${bcrypt.hashSync('1234',salt)}`)

  async function f() {
    try {
      var query =
        "select ID,Formulario,CargoID,Codigo,Nombre,Apellidos from WEB_API_TABLES.dbo.tbEmpleados WHERE Pwd_Hashed is not NULL and ContratoEstadoID = 1;";
      var resultado = await MES_query(query);
      res.send({ user: resultado.query });
    } catch {
      console.log("Error de obtención de datos");
    }
  }

  f();
});

app.post("/Login", (request, reply) => {
  async function f() {
    console.table(request.body);

    var { Usuario, Pass } = request.body;

    var q_usuario = `
      select Codigo,Pwd_Hashed 
      from WEB_API_TABLES.dbo.tbEmpleados 
      WHERE 
        ID = ${request.body.Usuario[0].ID}
    `;
    var res_user = await MES_query(q_usuario);

    console.table(res_user.query[0]);

    var token = bcrypt.compareSync(Pass, res_user.query[0].Pwd_Hashed);
    console.table(token);
    reply.send({ token: token });
  }
  try {
    f();
  } catch {
    console.error("Error obteniendo la contraseña y/o el usuario de l");
  }
});

app.get("/Profile/:user", (request, res) => {
  var user = request.params.user;
  async function f() {
    var query = `select * from WEB_API_TABLES.dbo.tbEmpleados where Codigo = '${user}';`;
    var resultado = await MES_query(query);
    //console.log(resultado.query)
    res.send({ user: resultado.query });
  }
  f();
});

app.post("/Profile", (request, res) => {
  var Codigo = request.body.Codigo;
  var Pwd_Hashed = request.body.NewPass;
  async function f() {
    var query = `update WEB_API_TABLES.dbo.tbEmpleados set Pwd_Hashed = '${Pwd_Hashed}' where Codigo = '${Codigo}';`;
    var resultado = await MES_query(query);
    console.log(resultado);
    //res.send({user : resultado.query})
  }
  f();
});

//*Registro de Planta
app.get("/RegPlanta", (request, res) => {
  async function f() {
    try {
      var resultado = await MES_query(
        fs.readFileSync("OF_UNIDAS.sql").toString()
      );
      res.send({ Datos: resultado.query });
    } catch {
      console.log("Fallo obtención de datos en Registro de Planta");
    }
    //console.log(resultado)
  }
  f();
});

/**
----------------------------------------REGISTRO DE PLANTA -----------------------------------------
*/
app.post("/RegPlanta", (request, res) => {
  console.log(request.body);
  async function f() {
    var query = `
        use MES; 
        Select 
            *
        from tbRegPlanta
        WHERE OrdenFabricacionID = '${request.body.OF}'
        
        `;
    var resultado_planta = await MES_query(query);

    var q_comun = `
            use MES;
            Select * from tbRegPlantaComun
            WHERE OrdenFabricacionID = '${request.body.OF}'
        `;
    var resultado_comun = await MES_query(q_comun);

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
        `;
    var resultado_resumen = await MES_query(q_resultado_resumen);
    console.log(resultado_resumen.query[0]);

    //Calculamos los datos del resumen
    var query_resumen_total = `
        use MES;
        Select *,
            ISNULL(Seleccion,0) - ISNULL(Ensacado,0) As SelEns
        from vwRegPlantaResumen
        WHERE
            OrdenFabricacion = '${request.body.OF}'
        ;
        `;
    var q_eciesa_derecha = `
        use HTM;
        SELECT 
        Componente, Lote, Linea, Ubicacion, 
        Sum(Cantidad) AS CantidadTotal
        FROM Tabla_PESADAS
        WHERE
            OrdenFabricacion = '${request.body.OF}'
        GROUP BY OrdenFabricacion, Componente, Lote, Linea, Ubicacion;

        `;
    /*
        try{
            var resultado_eciesa_derecha = await MES_query_ECIESA(q_eciesa_derecha) 
            console.table(resultado_eciesa_derecha.query)  
        }
        catch{
            console.debug("FALLA LA CONSULTA DE ECIESA")
        }
        */
    var resultado_query_resumen_total = await MES_query(query_resumen_total);
    res.send({
      DatosRegPlanta: resultado_planta.query,
      DatosRegPlantaComun: resultado_comun.query,
      Resumen: resultado_resumen.query[0],
      ResumenTotal: resultado_query_resumen_total.query[0],
    });
  }
  f();
});

app.get("/AdmUsers", (request, reply) => {
  async function f() {
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
        ORDER BY Codigo
        ;`;

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
        `;
    let res_last_code = await MES_query(q_last_code);
    var str_cod = String(res_last_code.query[0].Codigo);
    var [trash, numero] = str_cod.split("E");

    reply.send({
      Usuarios: res_usuarios.query,
      NextCode: `E${parseInt(numero) + 1}`,
    });
  }

  f();
});

app.post("/UpdateAdmUsers", (request, reply) => {
  console.log(request.body.Usuario);
  async function f() {
    const User = request.body.Usuario;
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
        `;
    var res_Update = await MES_query(q_update_user);
  }
  f();
});

app.post("/NewAdmUsers", (request, reply) => {
  console.log(request.body);
  async function f() {
    //Tratamos el alias
    var [ap1, ap2] = request.body.Apellidos.split(" ");
    var alias = request.body.Nombre[0] + ap1[0] + ap2[0];
    console.log(`ALIAS :${alias}`);
    var q_insercion = `
        use WEB_API_TABLES;
        INSERT INTO tbEmpleados (Codigo,Apellidos,Nombre,TratamientoID,CargoID,ContratoEstadoID)
        VALUES('${request.body.Codigo}', '${request.body.Apellidos}','${request.body.Nombre}',
        ${request.body.TratamientoID}, ${request.body.CargoID}, ${request.body.ContratoEstadoID}
        )
        `;
    let res_insercion = await MES_query(q_insercion);
  }
  f();
});

app.post("/EraseAdmUsers", (request, reply) => {
  async function f() {
    var erase = await MES_query(
      `USE WEB_API_TABLES; DELETE FROM tbEmpleados WHERE ID = ${request.body.ID}`
    );
  }
  f();
});

app.get("/RegistroPlanta/Trazabilidad/:OF", (request, res) => {
  async function f() {
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
        `;
    var q_resultado_resumen = `
        use MES;
        select *
        from 
            vwRegPlantaResumen
        WHERE
            OrdenFabricacion = '${OF}';
        ;
        `;
    var q_fechas = `
        use MES;
        SELECT 
            FechaInicio, FechaFin,ProductoID,Observacion as Observaciones
        from 
            tbRegPlantaComun
        WHERE
            OrdenFabricacionID = '${OF}'
        `;
    var q_env_p = `
        use MES;
        Select EnPor,Comentario
        from OFEnviado
        WHERE
            [OF] = '${OF}'
        `;
    var q_total_ensacado = `
        use MES;
        SELECT
            SUM(Cantidad) as TotalEnsacado
        from TablaAuxiliar4
        where
            [OF] = '${OF}';
        `;
    var q_resto = `
        use MES;
        SELECT
            REPLACE(Resto,',','.') as Resto
        from TablaAuxiliar4
        where
            [OF] = '${OF}'
            and Resto <> ''
        `;
    try {
      var resultado_resumen = await MES_query(q_resultado_resumen);
      var resultado_fechas = await MES_query(q_fechas);
      var res_trace_data = await MES_query(q_get_trace_data);
      var res_env_p = await MES_query(q_env_p);
      var res_total_ensacado = await MES_query(q_total_ensacado);
      var res_resto = await MES_query(q_resto);

      res.send({
        Trazabilidad: res_trace_data.query,
        DatosResumen: resultado_resumen.query[0],
        Fechas: resultado_fechas.query[0],
        EnPor: res_env_p.query[0].EnPor,
        Comentario: res_env_p.query[0].Comentario,
        TotalEnsacado: res_total_ensacado.query[0].TotalEnsacado,
        Resto: res_resto.query[0].Resto,
      });
    } catch {
      console.log("Falla la lectura de la trazabilidad");
    }
  }
  f();
});

app.post("/RegistroPlanta/UpdateTrazabilidad", (request, reply) => {
  async function f() {
    const T = request.body.Trazabilidad;
    var q_update = `
            use MES;
                Update TablaAuxiliar4
                    SET 
                        Cantidad = ${T.Cantidad},
                        Resto = '${T.Resto}'
                where
                    ID = ${T.ID}
        `;
    await MES_query(q_update);
  }
  f();
});

app.post("/RegPlanta/Trazabilidad", (request, reply) => {
  console.log(request.body);
  var OF = request.body.OF;
  var ModPr = request.body.ModPor;
  var EnvPor = request.body.EnvPor;
  async function f() {
    try {
      var q_update_insercion = `
            use MES;
            BEGIN 
                /*En caso de que ya existe un registro se modifica*/
                IF EXISTS(
                    Select *
                    from OFEnviado
                    WHERE
                        [OF] = '${OF}'
                    )
                BEGIN
                    UPDATE OFEnviado
                        SET [EnPor] = '${EnvPor}',
                            [ModPor] = '${ModPr}'
                    WHERE
                        [OF] = '${OF}'
                END
                /*Si no existe, lo insertamos */
                IF NOT EXISTS (
                    Select *
                    from OFEnviado
                    WHERE
                        [OF] = '${OF}'
                )
                BEGIN
                    INSERT INTO OFEnviado ([OF],EnPor,ModPor)
                    VALUES ('${OF}','${EnvPor}','${ModPr}')
                END
                
            END
            `;
      var res_update = await MES_query(q_update_insercion);
    } catch {
      console.log("Error post en registro de planta (Trazabilidad)");
    }
  }
  f();
});
app.get("/RegistroPlanta/GestionDesperdicios/:OF", (request, reply) => {
  var OF = request.params.OF;
  async function f() {
    try {
      var q_residuo_des = `
            use MES;
            SELECT 
                *
            FROM 
                OFResiduoDes
            WHERE
                [OF] = '${OF}'
            ;`;

      var q_residuo_rech = `
            Use MES;
            SELECT
                *
            FROM 
                OFResiduoRech
            WHERE
                [OFResiduoRech].[OF] = '${OF}'
            ;`;

      var res_residuo_rech = await MES_query(q_residuo_rech);
      var res_residuo_des = await MES_query(q_residuo_des);
      reply.send({
        Rech: res_residuo_rech.query[0],
        Des: res_residuo_des.query[0],
      });
    } catch {
      console.log("Error consulta datos gestion desperdicio");
    }
  }
  f();
});

app.get("/Mantenimiento/Tareas", (request, reply) => {
  async function f() {
    var q_empleados = `

                select ID,Codigo,Alias,Nombre,Apellidos, '00:00' as tiempo
                from WEB_API_TABLES.dbo.tbEmpleados 
                WHERE Pwd_Hashed is not NULL and ContratoEstadoID = 1;`;

    var q_maquinas = `
            use MES;
            SELECT
                tbCOD1.Nombre as 'COD1NOMBRE'
            FROM tbCOD2 , tbCOD1, tbMaquina
            WHERE
                tbCOD1.ID = tbMaquina.COD1
                and
                tbCOD2.ID = tbMaquina.COD2
            GROUP BY tbCOD1.Nombre;
        `;
    var q_next_id = `
        use MES;
        select TOP 1
            (ID + 1) AS NextID
        FROM
            vwTareasMantenimiento
        ORDER BY ID DESC;
        `;
    var q_materiales = `
        use MES;
        select ID,Referencia,Descripcion, 0 as Cantidad
        from tbMaterial
        ORDER by Referencia;
        `;
    var res_next_id = await MES_query(q_next_id);
    var res_maquinas = await MES_query(q_maquinas);
    var res_empleados = await MES_query(q_empleados);
    var res_materiales = await MES_query(q_materiales);
    reply.send({
      Maquinas: res_maquinas.query,
      NextID: res_next_id.query[0],
      Empleados: res_empleados.query,
      Materiales: res_materiales.query,
    });
  }
  f();
});

app.post("/Mantenimiento/Tareas", (request, reply) => {
  console.log(request.body);
  async function f() {
    var q_maquinas = `
            USE MES;
            SELECT
                tbMaquina.ID, tbMaquina.Codigo AS Código,
                tbCOD1.Cod AS COD1, tbCOD2.Cod AS COD2,
                tbCOD1.Nombre AS COD1Nombre, tbCOD2.Nombre AS COD2Nombre,
                tbCOD2.COD1ID, tbMaquina.ID as MaquinaID
                FROM tbCOD2 , tbCOD1, tbMaquina
                WHERE
                    tbCOD1.ID = tbMaquina.COD1
                    and
                    tbCOD2.ID = tbMaquina.COD2
                    and
                    tbCOD1.Nombre = '${request.body.COD1}'
                ;
        `;

    try {
      var res_maquinas = await MES_query(q_maquinas);

      reply.send({ FilteredMaquina: res_maquinas.query });
    } catch {
      reply.send("Error obteniendo lista de maquinas con ese codigo");
    }
  }
  f();
});

app.post("/Mantenimiento/CreateTarea", (request, reply) => {
  async function f() {
    try {
      var DatosTarea = request.body.DatosTarea;
      //console.log(DatosTarea.FechaHora)
      var q_insercion_tarea = `
            USE MES;
            INSERT INTO tbTareas
                (Codigo, CriticidadID, Descripcion,
                CategoriaID,EstadoTareaID,FechaHora,
                EmpleadoNom,EquipoID,Observaciones)
            VALUES
                ('${DatosTarea.Codigo}', '${DatosTarea.CriticidadID}', '${DatosTarea.Descripcion}',
                ${DatosTarea.CategoriaID},${DatosTarea.EstadoTareaID},'${DatosTarea.FechaHora}',
                '${DatosTarea.Abreviatura}',${DatosTarea.EquipoID},'${DatosTarea.Observaciones}')
            `;
      var res_insercion_tarea = await MES_query(q_insercion_tarea);
      //Insertamos n acciones

      var NextIDTarea = await MES_query(`use MES;
                SELECT TOP 1 ID
                FROM 
                    tbTareas
                ORDER BY ID DESC
                ;
            `);

      var i = parseInt(request.body.NAcciones);
      var q_insercion_acciones = `
            USE MES;
            INSERT INTO tbAcciones
                (TareasID,Accion,Notas,FechaHora)
            VALUES
            `;
      console.log(i);
      var values = "";
      for (j = 0; j < i; ++j) {
        q_insercion_acciones += `(${NextIDTarea.query[0].ID}, '-','-','${DatosTarea.FechaHora}'),`;
      }
      var corrected_query =
        q_insercion_acciones.substring(0, q_insercion_acciones.length - 1) +
        ";";
      q_insercion_acciones = corrected_query;
      var res_insertar_acciones = await MES_query(q_insercion_acciones);
      console.log("Tarea Insertada");
    } catch {
      console.log("Error en la creacion de la tarea");
    }
  }
  f();
});

app.post("/Mantenimiento/ModificaAccion", (request, reply) => {
  async function f() {
    try {
      var q_insercion_accion = `
            USE MES;
            INSERT INTO tbAcciones
                (TareasID,Accion,Notas,FechaHora)
            VALUES
                (${NextIDTarea.query[0].ID}, '${DatosAccion.Accion}','${DatosAccion.Notas}','${DatosTarea.FechaHora}');
            `;
      var res_q_insercion_accion = await MES_query(q_insercion_accion);

      //Como el numero de empleados implicados es variable, tenemos que
      //preparar la query

      var q_insercion_AccEmpl = `
            USE MES;
            INSERT INTO tbAccEmpleados
                (AccionID, EmpleadoID,AccionTiempo,FechaCreacion)
            VALUES
            `;

      var q_NextID_Accion = `
            use mes;
                select top 1 ID as NEXTID from tbAcciones order by ID desc;
            `;
      var AccNEXTID = await MES_query(q_NextID_Accion);

      EmpleadosAccion.map((i) => {
        q_insercion_AccEmpl += `(${AccNEXTID.query[0].NEXTID},${i.ID},'${i.tiempo}','${DatosTarea.FechaHora}'),`;
      });
      var corrected_query =
        q_insercion_AccEmpl.substring(0, q_insercion_AccEmpl.length - 1) + ";";
      q_insercion_AccEmpl = corrected_query;

      var res_insercionAccEmpl = await MES_query(q_insercion_AccEmpl);

      //Vinculamos accion con materiales
      var q_AccMateriales = `
            USE MES;
            INSERT INTO tbAccMaterial
                (AccionID, MaterialID,CantidadMaterial,EstadoConsumoID)
            VALUES 
            `;
      MaterialesUsados.map((i) => {
        q_AccMateriales += `(${AccNEXTID.query[0].NEXTID}, ${i.ID},${i.Cantidad},1),`;
      });

      corrected_query =
        q_AccMateriales.substring(0, q_AccMateriales.length - 1) + ";";
      q_AccMateriales = corrected_query;
      var insercion_AccMateriales = await MES_query(q_AccMateriales);
    } catch {
      console.log("Error Modificando Acciones");
    }
  }
  f();
});

app.get("/Mantenimiento/ListaTareas", (request, reply) => {
  async function f() {
    var q_lista_tareas = `
      USE MES;  
      SELECT 
          tbTareas.ID, Codigo, tbTareasEstados.Nombre as Estado,tbTareas.Descripcion as Descripcion
        FROM tbTareas,tbTareasEstados
      Where
          tbTareas.EstadoTareaID = tbTareasEstados.ID
      order by ID desc;
      `;
    var res_lista_tareas = await MES_query(q_lista_tareas);

    reply.send({ ListaTareas: res_lista_tareas.query });
  }
  f();
});

app.post("/Mantenimiento/Tarea", (request, reply) => {
  async function f() {
    try {
      var q_get_tarea = `
        use MES;
        SELECT top 1 
            ID, Codigo,
            CriticidadID,
            Descripcion,
            CategoriaID,
            EstadoTareaID,
            FechaHora,
            EmpleadoNom
        FROM tbTareas
        WHERE
            ID = '${request.body.ID}';`;
      var q_accion_vinculada = `
            use MES;
            SELECT 
                ID,TareasID,Accion,
                Notas,FechaHora
            FROM 
                tbAcciones
            WHERE
                TareasID = '${request.body.ID}'
            ;
        `;
      var res_get_tarea = await MES_query(q_get_tarea);
      var res_get_accion = await MES_query(q_accion_vinculada);
      if (res_get_accion.query.length !== 0) {
        var q_empleados_accion = `
            use MES;
            SELECT 
                *
            FROM 
                tbAccEmpleados
            WHERE
                AccionID = '${res_get_accion.query[0].ID}'
            ;
            `;
        var res_get_empleados_accion = await MES_query(q_empleados_accion);
        var q_materiales_accion = `
                use MES;
                SELECT 
                    *
                FROM 
                    tbAccMaterial
                WHERE
                    AccionID = '${res_get_accion.query[0].ID}'
                ;
            `;
        var res_get_materiales_accion = await MES_query(q_materiales_accion);
        reply.send({
          Tarea: res_get_tarea.query[0],
          Accion: res_get_accion.query,
          Empleados: res_get_empleados_accion.query,
          MaterialesAccion: res_get_materiales_accion.query,
        });
      } else {
        reply.send({
          Tarea: res_get_tarea.query[0],
          Accion: [],
          MaterialesAccion: [],
          EmpleadosAccion: [],
        });
      }
    } catch {
      console.log("Error obteniendo datos de la tarea");
    }
  }
  f();
});

//Se encarga de crear una nueva accion vacia
app.post("/Mantenimiento/NewAccion", (request, reply) => {
  async function f() {
    try {
      var q_insercion_accion_vacia = `
            USE MES;
            INSERT INTO tbAcciones
                (TareasID,Accion,Notas,FechaHora)
            VALUES
                ('${request.body.TAREAID}','Sin descripción asociada','Sin Notas Asociadas','${request.body.FechaHora}');
            `;
      var res_q_insercion_accion = await MES_query(q_insercion_accion_vacia);
    } catch {
      console.log("Error de insercion");
    }
  }
  f();
});

app.post("/Mantenimiento/DelAccion", (request, reply) => {
  async function f() {
    var q_delete_accion = `
            USE MES;
            DELETE FROM tbAccMaterial
            WHERE
                AccionID = ${request.body.AccionID};

            DELETE FROM tbAccEmpleados
            WHERE
                AccionID = ${request.body.AccionID};

            DELETE FROM tbAcciones
            WHERE
                ID = ${request.body.AccionID};
        `;
    var erase_accion = await MES_query(q_delete_accion);
  }
  f();
});

app.post("/Mantenimiento/UpdateAccion", (request, reply) => {
  async function f() {
    var { Accion } = request.body;
    console.table(Accion);
    var q_update_accion = `
        USE MES;
        UPDATE tbAcciones
        SET Accion = '${Accion.Accion}', Notas = '${Accion.Notas}'
        WHERE
            ID = ${Accion.ID};
        `;
    var res_update = await MES_query(q_update_accion);
  }
  f();
});

app.get("/Mantenimiento/Tareas/DatosAccion/:AccionID", (request, reply) => {
  async function f() {
    var AccionID = request.params.AccionID;
    //var AccionID = 27072;
    try {
      var q_empleados_accion = `
            use MES;
            SELECT 
                *
            FROM 
                tbAccEmpleados
            WHERE
                AccionID = '${AccionID}'
            ;
            `;
      var res_get_empleados_accion = await MES_query(q_empleados_accion);
      var q_materiales_accion = `
                use MES;
                SELECT 
                    *
                FROM 
                    tbAccMaterial
                WHERE
                    AccionID = '${AccionID}'
                ;
            `;
      var res_get_materiales_accion = await MES_query(q_materiales_accion);
      console.table(res_get_materiales_accion);
      reply.send({
        Empleados: res_get_empleados_accion.query,
        MaterialesAccion: res_get_materiales_accion.query,
      });
    } catch {
      console.log("Fallo");
    }
  }
  f();
});

app.post("/Mantenimiento/Tareas/UpdateEmpleadoAccion", (request, reply) => {
  async function f() {
    try {
      //console.table(request.body);
      var { Empleado, AccionID } = request.body;
      var q_update_emp;
      if (Empleado !== "VACIO") {
        q_update_emp = `
        use MES;

        DELETE FROM tbAccEmpleados
        WHERE
          AccionID = ${AccionID}
          AND
          EmpleadoID = ${Empleado.ID};
        
        INSERT INTO tbAccEmpleados (AccionID, EmpleadoID,AccionTiempo)
          VALUES(${AccionID},${Empleado.ID},'${Empleado.tiempo}');
      `;
      } else {
        q_update_emp = `USE MES; DELETE FROM tbAccEmpleados WHERE AccionID = ${AccionID}`;
      }

      let res_update_emp = await MES_query(q_update_emp);
    } catch {
      console.error("Error actualizando al empleado dado");
    }
  }
  f();
});

app.post("/Mantenimiento/Tareas/DelTarea", (request, reply) => {
  async function f() {
    try {
      let q_borrar_Tarea = `
        USE MES;
        USE MES;
        DELETE FROM tbAccMaterial
        WHERE
            AccionID = (
              Select ID
              from tbAcciones
              where TareasID = ${request.body.TareaID}
            )
        ;
        DELETE FROM tbAccEmpleados
        WHERE
            AccionID = (
              Select ID
              from tbAcciones
              where TareasID = ${request.body.TareaID}
            );
        DELETE FROM tbAcciones
        WHERE
            TareasID = ${request.body.TareaID};
        DELETE FROM tbTareas
        WHERE 
          ID = ${request.body.TareaID};
        `;
      let res_del_Tarea = await MES_query(q_borrar_Tarea);
    } catch {
      console.error("Fallo en la eliminacion de la tarea");
    }
  }
  f();
});

app.post("/Mantenimiento/Tareas/UpdateTarea", (request, reply) => {
  async function f() {
    try {
      var { Tarea, Descripcion } = request.body;

      var q_update_tarea = `
      use MES;
      UPDATE tbTareas
      SET
          CriticidadID =${Tarea.CriticidadID} ,
          Descripcion ='${Descripcion}',
          CategoriaID=${Tarea.CategoriaID},
          EstadoTareaID=${Tarea.EstadoTareaID},
          FechaHora= '${Tarea.FechaHora}',
          Codigo= '${Tarea.Codigo}'
      WHERE
          ID = ${Tarea.ID}
    `;
      var r_update_tarea = await MES_query(q_update_tarea);
    } catch {
      console.log("Error en la actualización de la tarea");
    }
  }
  f();
});

app.post("/Mantenimiento/Tareas/UpdateMaterialAccion", (request, reply) => {
  console.log(request.body);
  async function f() {
    var { Material, AccionID } = request.body;
    console.log(Material);
    var q_update_mat = "";

    if (Material !== "VACIO") {
      q_update_mat = `
      use MES;
      DELETE FROM tbAccMaterial
      WHERE
        AccionID = ${AccionID}
        AND
        MaterialID = ${Material.ID}
      INSERT INTO tbAccMaterial (AccionID, MaterialID,CantidadMaterial,EstadoConsumoID)
      VALUES(${AccionID},${Material.ID},${Material.Cantidad},1);
      `;
    } else {
      q_update_mat = `USE MES;DELETE FROM tbAccMaterial WHERE AccionID = ${AccionID};`;
    }
    var res_q_update = await MES_query(q_update_mat);
  }

  try {
    f();
  } catch {
    console.log("Error en la inserción/actualización de la tarea");
  }
});
