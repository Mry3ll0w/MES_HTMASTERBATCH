use MES;

SELECT 
    ISNULL(t1.Produccion,0) + ISNULL(t2.Produccion,0) as Produccion,
    ISNULL(t1.Seleccion,0) + ISNULL(t2.Seleccion,0) as Seleccion,
    ISNULL(t1.Rechazo,0) + ISNULL(t2.Rechazo,0) as Rechazo,
    ISNULL(t4.Ensacado,0) + ISNULL(t2.Ensacado,0) as Ensacado,
    ISNULL(t1.RechazoTA,0) + ISNULL(t2.RechazoTA,0) as RechazoTA,
    ISNULL(t1.Desperdicio,0) + ISNULL(t2.Desperdicio,0) as Desperdicio,
    ISNULL(t3.Plasta,0) as Plasta,
    (ISNULL(t1.Seleccion,0) + ISNULL(t2.Seleccion,0) - (ISNULL(t4.Ensacado,0) + ISNULL(t2.Ensacado,0))) as Sel_Ens
    
from 
    (
        select top 1
            Produccion ,
            Seleccion ,
            Rechazo ,
            
            RechazoTA,
            Desperdicio,
            Plasta
        from
            tbRegPlanta as O
        where 
            OrdenFabricacionID = '50956'
            and
            ObjetoID = 2
        order by FechaHoraReg desc
    )t1

    cross join 
    (
        select 
            Produccion ,
            Seleccion ,
            Rechazo ,
            Ensacado,
            RechazoTA,
            Desperdicio,
            Plasta
        from
        tbRegPlanta
        where 
        OrdenFabricacionID = '50956'
        and
        ObjetoID = 12
    ) t2
    cross JOIN
    (
        SELECT top 1
            Plasta
        from 
        tbRegPlanta    
        where 
        OrdenFabricacionID = '50956'
        
    ) t3
CROSS JOIN
    (
        SELECT SUM(ENSACADO) as Ensacado
        FROM tbRegPlanta
        WHERE OrdenFabricacionID = '50956'
        and ObjetoID <> 12 
    ) t4
;
