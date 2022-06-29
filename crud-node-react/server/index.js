const express = require('express')
let sql = require("mssql")
const app = express();
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
  //Running the query
  req.query("Select TOP 10 * from peliculas;", (err, rs) => {
    if(err){
      console.log("hay errores, en query");
      console.log(err);
    }
    else{
      console.log(rs);
      resultado = rs;
    }
    conn.close();//HAY QUE CERRAR LA CONEXION tras la query
  });
});

//Creamos la rutina para la aplicacion
app.listen("3001");

app.get("/", (req, res) => {
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
  //Running the query
  req.query("INSERT INTO peliculas (moviename,review) VALUES('p2','ta wena la peli');", (err, rs) => {
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
