let sql = require("mssql")

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
conn.connect((err) => {
  if(err){
    console.log("hay errores");
    console.log(err);
  }
  console.log("Connected")
  //Running the query
  req.query("Select * from peliculas", (err, rs) => {
    if(err){
      console.log("hay errores, en query");
      console.log(err);
    }
    else{

      console.log(rs);
    }
    conn.close();//HAY QUE CERRAR LA CONEXION tras la query
  });
});