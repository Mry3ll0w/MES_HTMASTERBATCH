let sql = require("mssql")

let dbconfig = {
  server: "marketing",
  port : 1433,
  database :"master",
  user :"sa",
  password: process.env.htm_auth,
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
  req.query("Select TOP 10 * from Mes.dbo.tbRegEnsacado;", (err, rs) => {
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