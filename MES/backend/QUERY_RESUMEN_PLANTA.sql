use MES;

DECLARE @S_Ensacado FLOAT;
SET @S_Ensacado = ISNULL((
    SELECT SUM(ENSACADO) as Ensacado
FROM tbRegPlanta
WHERE OrdenFabricacionID = '50956'
    and ObjetoID <> 12 
),0);

SELECT @S_Ensacado AS SUMA_ENSACADO;

DECLARE @V_Plasta FLOAT;
SET @V_Plasta = ISNULL(
    (
        SELECT top 1
    Plasta
from
    tbRegPlanta
where 
            OrdenFabricacionID = '50956'

        )
,0);


/*
Para hacer mas limpia la consulta y poder corregir el caso de no tener valor en la consulta, hago las consultas a parte

*/
DECLARE @A_PRODUCCION FLOAT;
SET @A_PRODUCCION = ISNULL( (select
    Produccion
from
    tbRegPlanta
where 
        OrdenFabricacionID = '50956'
    and
    ObjetoID = 12),0);

DECLARE @A_SELECCION FLOAT;
SET @A_SELECCION = ISNULL((select
    Seleccion
from
    tbRegPlanta
where 
        OrdenFabricacionID = '50956'
    and
    ObjetoID = 12) ,0);

DECLARE @A_RECHAZO FLOAT;
SET @A_RECHAZO = ISNULL((select
    Rechazo
from
    tbRegPlanta
where 
        OrdenFabricacionID = '50956'
    and
    ObjetoID = 12) ,0);

DECLARE @A_ENSACADO FLOAT;
SET @A_ENSACADO = ISNULL( (
    select
    Ensacado
from
    tbRegPlanta
where 
        OrdenFabricacionID = '50956'
    and
    ObjetoID = 12
),0);

DECLARE @A_RECHAZOTA FLOAT;
SET @A_RECHAZOTA = ISNULL( (select
    RechazoTA
from
    tbRegPlanta
where 
    OrdenFabricacionID = '50956'
    and
    ObjetoID = 12),0);

DECLARE @A_DESPERDICIO FLOAT;
SET @A_DESPERDICIO = ISNULL((select
    Desperdicio
from
    tbRegPlanta
where 
        OrdenFabricacionID = '50956'
    and
    ObjetoID = 12),0);

SELECT @A_ENSACADO AS T2_ENSACADO

SELECT @S_Ensacado + @A_ENSACADO AS ENSACADO_DEF;
DECLARE @ENSACADO_DEF FLOAT;
SET @ENSACADO_DEF = @S_Ensacado + @A_ENSACADO;

SELECT
    COALESCE(ISNULL(t1.Produccion,0) + ISNULL(@A_PRODUCCION,0),0) as Produccion,
    ISNULL(t1.Seleccion,0) + ISNULL(@A_SELECCION,0) as Seleccion,
    ISNULL(t1.Rechazo,0) + ISNULL(@A_RECHAZO,0) as Rechazo,
    @ENSACADO_DEF as Ensacado,
    ISNULL(t1.RechazoTA,0) + ISNULL(@A_RECHAZOTA,0) as RechazoTA,
    ISNULL(t1.Desperdicio,0) + ISNULL(@A_DESPERDICIO,0) as Desperdicio,
    ISNULL(@V_Plasta,0) as Plasta,
    (ISNULL(t1.Seleccion,0) + ISNULL(@A_SELECCION,0) - @ENSACADO_DEF) as Sel_Ens

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

;
