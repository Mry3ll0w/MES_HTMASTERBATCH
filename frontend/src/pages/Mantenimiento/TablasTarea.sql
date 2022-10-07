use MES;
/* Para insertar los datos de las Tareas

INSERT INTO vwTareasMantenimiento
    (Codigo, CriticidadID, Descripcion,
    CategoriaID,EstadoTareaID,FechaHora,
    Abreviatura)
VALUES(

)
Insertar datos en acciones

INSERT INTO tbAcciones
    (TareasID,Accion,Notas,FechaHora)
VALUES
    ()

Vincular acciones y materiales

INSERT INTO tbAccMaterial
    (AccionID, MaterialID,CantidadMaterial,EstadoConsumoID)
VALUES

Vincular empleados con acciones
INSERT INTO tbAccEmpleados
    (AccionID, EmpleadoID,AccionTiempo,FechaCreacion)
VALUES
    ()

Vincular acciones con Tarea
INSERT into vwTareasAcciones
    (TareasID,AccionID,AccEmpID,AccionTiempo)
VALUES(
    
)

*/


SELECT * FROM tbAcciones 
WHERE
    TareasID = 25538
ORDER BY ID DESC;
