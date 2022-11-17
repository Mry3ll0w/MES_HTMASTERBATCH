const express = require("express");
const app = express();
const multer = require("multer");
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

//Multer Config
let MulterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public/materiales");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let ImgUpload = multer({ storage: MulterStorage });

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
  }
}

async function MES_query(q) {
  try {
    const DB = await connectDB();

    const result = await DB.request().query(q);
    DB.close();
    return { query: result.recordset };
  } catch (err) {
    console.log(`Error querying database, query usada ${q}`, err);

    //return {query :err, ok : false};
  }
}

app.get("/RegEnsacado", (request, res) => {
  async function query() {
    try {
      let q_ensacados = await MES_query(
        `use WEB_API_TABLES;
        SELECT *
        FROM RegistroEnsacado
        WHERE
            FechaEliminacion IS NULL
            AND
            EliminadoPor IS NULL
        order by ID desc
        `
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
      Ant = ${request.body.Ant}, Observaciones = '${request.body.Observaciones}',
      ModificadoPor = '${request.body.iniciales}'
      WHERE ID = ${request.body.ID};`
    );
    console.log(q_ins);
  }
  try {
    q();
  } catch {
    console.log("Error en UpdateEnsacado");
  }
});

app.post("/RegistraEnsacado", (request, res) => {
  console.log(request.body);
  const E = request.body;
  async function q() {
    var q_ins =
      await MES_query(`INSERT INTO [WEB_API_TABLES].[dbo].[RegistroEnsacado] (Fecha, Turno, Producto, Palet, Peso_Saco,Cantidad, Resto, Ant, iniciales, Observaciones,ModificadoPor) 
        VALUES('${E.Fecha}','${E.Turno}', '${E.Producto}','${E.Palet}', '${E.Peso_Saco}',${E.Cantidad},'${E.Resto}',${E.Ant},'${E.iniciales}', '${E.Observaciones}','-');`);
    console.log(q_ins);
  }
  try {
    q();
  } catch {
    console.log("Error en RegistraEnsacado");
  }
});

app.post("/DelEns", (request, res) => {
  //console.log(request.body);
  const E = request.body;
  async function q() {
    var q_ins = await MES_query(
      `
      use WEB_API_TABLES;
      UPDATE RegistroEnsacado
      SET
        FechaEliminacion = GETDATE(),
        EliminadoPor = '${E.Iniciales}' 
      WHERE
        ID = ${E.ID};`
    );
    console.log(q_ins);
  }
  try {
    q();
  } catch {
    console.log("Error en DelEns");
  }
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
  try {
    query();
  } catch {
    console.log("Error en /dataEstadistico");
  }
});

app.post("/calcEstadistico", (request, res) => {
  async function q() {
    try {
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
        order by FechaHora asc;`;

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
            order by FechaHora asc;
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
    var { Usuario, Pass } = request.body;
    console.log(Usuario);
    var q_usuario = `
      select Codigo,Pwd_Hashed 
      from WEB_API_TABLES.dbo.tbEmpleados 
      WHERE 
        ID = ${Usuario[0].ID}
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
  try {
    f();
  } catch {
    console.error("Error accediendo al perfil del usuario");
  }
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
  try {
    f();
  } catch {
    console.log("Error en post de /Profile");
  }
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
  try {
    f();
  } catch {
    console.log("error en get de /RegPlanta");
  }
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
  try {
    f();
  } catch {
    console.log("Error post /RegPlanta");
  }
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
  try {
    f();
  } catch {
    console.log("Error en get /AdmUsers");
  }
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
  try {
    f();
  } catch {
    console.log("Error en post /UpdateAdmUsers");
  }
});

app.post("/NewAdmUsers", (request, reply) => {
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
  try {
    f();
  } catch {
    console.log("Error en post /NewAdmUsers");
  }
});

app.post("/EraseAdmUsers", (request, reply) => {
  async function f() {
    var erase = await MES_query(
      `USE WEB_API_TABLES; DELETE FROM tbEmpleados WHERE ID = ${request.body.ID}`
    );
  }
  try {
    f();
  } catch {
    console.log("Error en post /EraseAdmUsers");
  }
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
  try {
    f();
  } catch {
    console.log("Error en get trazabilidad");
  }
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
  try {
    f();
  } catch {
    console.log("Error en post regplanta/updateTraza");
  }
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
  try {
    f();
  } catch {
    console.log("Error en RegPlanta trazabilidad post");
  }
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
  try {
    f();
  } catch {
    console.log("Error querying en tareas mantenimiento");
  }
});

app.post("/Mantenimiento/Tareas", (request, reply) => {
  console.log(request.body);
  async function f() {
    var q_maquinas = `
            USE MES;

                SELECT 
                    id as EquipoID,
                    Codigo,
                    Cod2Nombre,
                    COD2
                FROM 
                    vwEquipos
                WHERE
                    Cod1Nombre = '${request.body.COD1}'
                order by id DESC;
                
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
          tbTareas.ID, tbTareas.Codigo,
          tbTareasEstados.Nombre as Estado, tbTareas.Descripcion as Descripcion,
          vwEquipos.Cod2Cod as Cod
      FROM tbTareas, tbTareasEstados, vwEquipos, tbMaquina
      Where
          tbTareas.EstadoTareaID = tbTareasEstados.ID
          AND
          tbTareas.EquipoID = vwEquipos.ID
          and 
          tbMaquina.COD2 = vwEquipos.COD2
      order by ID desc;
      `;
    var res_lista_tareas = await MES_query(q_lista_tareas);

    //Obtencion de los codigo 2 para filtrar el datagrid
    var q_lista_COD2 = "use MES; SELECT nombre,cod FROM tbCOD2;";
    var res_lista_COD2 = await MES_query(q_lista_COD2);

    reply.send({
      ListaTareas: res_lista_tareas.query,
      ListaCOD2: res_lista_COD2.query,
    });
  }
  f();
});

app.post("/Mantenimiento/Tarea", (request, reply) => {
  async function f() {
    try {
      console.table(request.body);
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
                Notas,FORMAT(FechaHora, 'yyyy-MM-dd') as FechaHora
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
        SET Accion = '${Accion.Accion}', Notas = '${Accion.Notas}', FechaHora = '${Accion.FechaHora}'
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
      console.log(request.body);
      var {
        Tarea,
        Descripcion,
        CategoriaID,
        CriticidadID,
        EstadoTareaID,
        NewCodigo,
        NewFecha,
      } = request.body;

      var q_update_tarea = `
      use MES;
      UPDATE tbTareas
      SET
          CriticidadID =${CriticidadID} ,
          Descripcion ='${Descripcion}',
          CategoriaID=${CategoriaID},
          EstadoTareaID=${EstadoTareaID},
          FechaHora= '${NewFecha}',
          Codigo= '${NewCodigo}'
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

app.get("/Mantenimiento/RepuestosMaquina", (request, reply) => {
  async function f() {
    var q_lista_COD1 = `
    USE MES;
    SELECT 
      Cod,
      ISNULL(Descripcion,'Sin descripción') as Descripcion
    FROM 
      tbCOD1;
    `;

    var q_lista_COD2 = `
    USE MES;
    SELECT 
      Cod,ISNULL(Descripcion,'Sin descripción') as Descripcion
    FROM 
    tbCOD2;
    `;

    var q_get_maquinas = `
      USE MES;
      SELECT 
          tbMaquina.ID,tbMaquina.Codigo,
          tbCOD0.Cod as COD0,
          tbCOD1.Cod as COD1,
          tbCOD2.Cod as COD2,
          tbMaquina.Descripcion
      FROM tbMaquina INNER join tbCOD0 
      ON
          tbCOD0.id = tbMaquina.COD0
      INNER JOIN tbCOD1 ON
          tbCOD1.id = tbMaquina.COD1
      INNER JOIN tbCOD2 ON
          tbCOD2.id = tbMaquina.COD2
      order by Codigo;`;

    var sQueryListaRepuesto = `
      USE MES;
      SELECT 
        tbMaterial.ID as ID, Descripcion
      FROM 
        tbMaterial,tbMaquinaMaterial
      WHERE
        MaterialID = tbMaterial.ID
      GROUP by tbMaterial.ID, Descripcion
    `;

    var res_maquinas = await MES_query(q_get_maquinas);
    var res_cod1 = await MES_query(q_lista_COD1);
    var res_cod2 = await MES_query(q_lista_COD2);
    var qListaRepuesto = await MES_query(sQueryListaRepuesto);
    var aLCOD1 = [];
    var aLCOD2 = [];
    var aLRepuestos = [];
    res_cod1.query.map((i) => {
      aLCOD1.push(`${i.Cod} | ${i.Descripcion}`);
    });
    res_cod2.query.map((i) => {
      aLCOD2.push(`${i.Cod} | ${i.Descripcion}`);
    });
    qListaRepuesto.query.map((i) => {
      aLRepuestos.push(`${i.ID} | ${i.Descripcion}`);
    });

    reply.send({
      Maquinas: res_maquinas.query,
      ListaCOD1: aLCOD1,
      ListaCOD2: aLCOD2,
      ListaRepuestos: aLRepuestos,
    });
  }
  try {
    f();
  } catch {
    console.log("Fallo en la obtencion de los datos de la maquina");
  }
});

app.post("/Mantenimiento/RepuestosMaquina", (request, reply) => {
  async function f() {
    var { sCodigoMaquina } = request.body;

    //Fetch de Datos del repuesto (primero los datos)
    var sQDatosMaterial = `
    use MES;
    select 
        MaterialID as Referencia, 
        tbMaterial.Descripcion as Descripcion,
        CONCAT(tbAlmacen.Nombre,tbPasillo.Nombre,tbEstanteria.Nombre,tbPiso.Nombre) as Ubicacion,
        vwInventarioStock.MatStock as Stock
    from tbMaquinaMaterial 
    INNER JOIN tbMaquina ON
        tbMaquina.ID = MaquinaID
        and
        tbMaquina.Codigo = '${sCodigoMaquina}'
    INNER JOIN tbMaterial on
        MaterialID = tbMaterial.ID
    LEFT JOIN tbAlmacen ON /* Usamos left para incluir los resultados con campos null*/
        tbMaterial.AlmacenID = tbAlmacen.ID
    LEFT JOIN tbPasillo ON 
        tbPasillo.ID = tbMaterial.PasilloID
    LEFT JOIN tbEstanteria ON
        tbEstanteria.ID = tbMaterial.EstanteriaID
    LEFT JOIN tbPiso ON 
        tbPiso.ID = tbMaterial.PisoID
    LEFT JOIN vwInventarioStock ON
        vwInventarioStock.MatID = tbMaterial.ID;
    `;

    var QDatosMaterial = await MES_query(sQDatosMaterial);

    reply.send({
      Materiales: QDatosMaterial.query,
    });
  }
  try {
    f();
  } catch {
    console.log("Error obteniendo los repuestos de la máquina");
  }
});

app.post("/Mantenimiento/RepuestosMaquina/UpdateStock", (request, reply) => {
  async function f() {
    var { iMatID, iSubstract } = request.body;
    var sQuery = `
      use MES;
      Insert Into tbMaterialAjustes (MatID,Ajuste)
      VALUES (${iMatID},-${iSubstract});
    `;
    var qUpdateStock = await MES_query(sQuery);
  }

  try {
    f();
  } catch {
    console.log("Error en la actualizacion del stock");
  }
});

app.get("/Mantenimiento/RepuestosMaquina/Stock/:iID", (request, reply) => {
  async function f() {
    var { iID } = request.params;
    var sQueryStringUpdate = `
      use MES;
      select MatStock from vwInventarioStock
      where MatID = ${iID};
    `;
    var qFetchStock = await MES_query(sQueryStringUpdate);
    reply.send({ Stock: qFetchStock.query[0].MatStock });
  }
  try {
    f();
  } catch {
    console.log("Error en la obtencion de datos del repuesto");
  }
});

app.get("/ServerState", (request, reply) => {
  async function f() {
    var sQueryStringServerState = `
      use WEB_API_TABLES;
      Select top 1 * from tbCargos;
    `;
    var qServerState = await MES_query(sQueryStringServerState);
    try {
      console.log("Comprobación de conexion realizada");
      reply.send({ Status: true });
    } catch {
      reply.send({ Status: false });
    }
  }
  try {
    f();
  } catch {
    reply.send({ Status: false });
  }
});

app.post(
  "/Mantenimiento/RepuestosMaquina/UpdatePhoto",
  ImgUpload.single("file"),
  function (req, res) {
    console.log("Imagen de repuesto subida");
  }
);

app.post("/Mantenimiento/RepuestosMaquina/Repuesto", (request, reply) => {
  async function f() {
    console.table(request.body.iMatID);
    var sQRepuesto = `
    use MES;
select top 1
    MaterialID as Referencia,
    tbMaterial.Descripcion as Descripcion,
    CONCAT(tbAlmacen.Nombre,tbPasillo.Nombre,tbEstanteria.Nombre,tbPiso.Nombre) as Ubicacion,
    vwInventarioStock.MatStock as Stock
from tbMaquinaMaterial
    INNER JOIN tbMaterial on
        MaterialID = tbMaterial.ID
        and
        tbMaterial.ID = '${request.body.iMatID}'
    LEFT JOIN tbAlmacen ON /* Usamos left para incluir los resultados con campos null*/
        tbMaterial.AlmacenID = tbAlmacen.ID
    LEFT JOIN tbPasillo ON 
        tbPasillo.ID = tbMaterial.PasilloID
    LEFT JOIN tbEstanteria ON
        tbEstanteria.ID = tbMaterial.EstanteriaID
    LEFT JOIN tbPiso ON 
        tbPiso.ID = tbMaterial.PisoID
    LEFT JOIN vwInventarioStock ON
        vwInventarioStock.MatID = tbMaterial.ID
    ;
    `;

    try {
      var QDatosMaterial = await MES_query(sQRepuesto);
      console.log(QDatosMaterial.query);
      reply.send({
        Materiales: QDatosMaterial.query,
      });
    } catch {
      console.log("Error en /Mantenimiento/RepuestosMaquina/Repuesto");
    }
  }
  f();
});

app.get("/Mantenimiento/AsignarTareas", (request, reply) => {
  async function f() {
    var sQGetTareasPendientes = `
      use MES;
      SELECT
          tbTareas.Codigo as Codigo,
          dbo.vwMaquinaCodigo.COD2,
          tbTareas.Descripcion as Descripcion,
          dbo.vwMaquinaCodigo.COD2Nombre,
          tbTareas.Descripcion as Descripcion,
          tbTareas.FechaProgramada as FechaProgramada,
          tbTareas.EmpleadoNom as EmpleadoNom,
          tbTareas.Activa as Activa,
          tbTareas.Orden as Orden,
          tbTareas.TiempoEstimado as TiempoEstimado,
          tbTareas.ID as ID,
          tbTareas.EmpleadoSec as EmpleadoSec,
          tbTareas.EmpleadoUn as EmpeladoUn
      FROM (
          tbManSegMaquinas INNER JOIN tbTareas ON 
          tbManSegMaquinas.ID = tbTareas.SegID)
          INNER JOIN dbo.vwMaquinaCodigo ON tbManSegMaquinas.MaquinaID = dbo.vwMaquinaCodigo.[ID]
      WHERE (((tbTareas.EstadoTareaID)=1))
      ORDER BY tbTareas.FechaProgramada, tbTareas.EmpleadoNom DESC , tbTareas.Orden;
    `;
    try {
      var qTareasPendientes = await MES_query(sQGetTareasPendientes);
      reply.send({ Tareas: qTareasPendientes.query });
    } catch {
      console.log("Error en la obtencion de las tareas (get AsignarTareas)");
    }
  }
  f();
});
