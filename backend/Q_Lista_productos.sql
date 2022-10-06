Select RTRIM(ProductoID) as ProductoID from MES.dbo.graRegInciExtendido
WHERE 
    ProductoID IS NOT NULL and ProductoID <>'PRUEBA'
    AND
    ProductoID <> 'CLD'
    AND
    ProductoID <> 'CLDN'
    AND
    ProductoID <> 'CLDNX'
    AND
    ProductoID <> 'CLEAN PPN'
    AND
    ProductoID <> 'HITEMA61560AB1.'
    AND 
    ProductoID <> 'HTM600CI'
    AND 
    ProductoID <> 'HTM6246MII.'
    AND
    ProductoID <> 'HTM6246MIIAP'
    AND
    ProductoID <> 'HTM6946M1AP'
    AND
    ProductoID <> 'LIMPIEZATORNILLO'
    
    
GROUP BY ProductoID order BY ProductoID;