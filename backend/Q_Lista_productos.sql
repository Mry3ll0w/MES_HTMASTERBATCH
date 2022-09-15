Select RTRIM(ProductoID) as ProductoID from MES.dbo.graRegInciExtendido
WHERE 
    ProductoID IS NOT NULL and ProductoID <>'PRUEBA'
GROUP BY ProductoID;