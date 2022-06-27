const express = require('express');
const app = express();

var Connection = require('tedious').Connection;  
    var config = {  
        server: 'localhost:1433',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'sa', //update me
                password: 'pasWORD1'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: 'master'  //update me
        }
    };  
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.
        console.log("Connectado a la base de datos");  
    });
    
connection.connect();

app.listen('3001', () => {
    console.log('Aplicacion en 3001 encendida');
});
