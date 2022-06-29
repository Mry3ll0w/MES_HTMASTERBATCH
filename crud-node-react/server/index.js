const express = require('express');
let sql = require("mssql");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('body-parser');
const async = require('async');
//Check de conexion a la base de datos
let dbconfig = {
  server: "localhost",
  port : 1433,
  database :"master",
  user :"sa",
  password: process.env.sql_auth,
  trustServerCertificate: true
}

//Creamos el objeto de conexion
var conn = new sql.ConnectionPool(dbconfig);
var req = new sql.Request(conn);
let resultado;
conn.connect((err) => {
  if(err){
    console.log("hay errores");
    console.log(err);
  }
  console.log("Connected")
  conn.close();//HAY QUE CERRAR LA CONEXION tras la query
});



//Creamos la rutina para la aplicacion
app.listen("3001");

app.get("/", (req, res) => {
conn.connect((err) => {
  if(err){
    console.log("hay errores");
    console.log(err);
  }
  console.log("Connected")
  //Running the query
  req.query("INSERT INTO peliculas (moviename,review) VALUES('p3','ta weno el corto');", (err, rs) => {
    if(err){
      console.log("hay errores, en query");
      console.log(err);
    }
    else{
      res.send("Realizada correctamente la insercion");
    }
    conn.close();//HAY QUE CERRAR LA CONEXION tras la query
  });
});
});

//usando bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());//Permitir coger la info del front end como json
app.use(cors());
//Recibimos un post desde react
app.post("/api/insert", (request,res) =>{

  conn.connect((err) => {
    if(err){
      console.log("hay errores");
      console.log(err);
    }
    console.log("Connected")
    //Running the query

    req.query(`INSERT INTO peliculas (moviename,review) VALUES('${request.body.pelicula}','${request.body.Review}')`, (err, rs) => {
      if(err){
        console.log("hay errores, en query");
        console.log(err);
        console.log("Valores de la insercion:");
        console.log(`Moviename: ${request.body.pelicula}`);
        console.log(`Review: ${request.body.Review}`);
      }
      else{
        console.log(rs);
        res.send("Realizada correctamente la insercion");
      }
      conn.close();//HAY QUE CERRAR LA CONEXION tras la query
    });
  });

});

//URL PARA MOSTRAR el contenido en front end
app.get("/api_get", (request, res) => {
  conn.connect((err) => {
    if(err){
      console.log("hay errores");
      console.log(err);
    }
    console.log("Connected")
    //Running the query
    req.query("Select * from dbo.peliculas;", (err, rs) => {
      if(err){
        console.log("hay errores, en query");
        console.log(err);
      }
      else{
        res.send(rs.recordset);
      }
      conn.close();//HAY QUE CERRAR LA CONEXION tras la query
    });
  });
});
