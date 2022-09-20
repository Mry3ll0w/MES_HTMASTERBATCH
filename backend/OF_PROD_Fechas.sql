use MES;
SELECT RTRIM(graRegInciExtendido.OrdenFabricacionID) as OrdenFabricacionID, Min(graRegInciExtendido.CompInicio) AS Fecha_Inicio, 
Max(graRegInciExtendido.CompFin) AS Fecha_Fin, 
graRegInciExtendido.ProductoID
FROM graRegInciExtendido
WHERE (((graRegInciExtendido.C0COD)='CON'))
GROUP BY graRegInciExtendido.OrdenFabricacionID, graRegInciExtendido.ProductoID
ORDER BY Min(graRegInciExtendido.CompInicio) DESC
;
