USE MES;


SELECT 
    vwOrdenesFabricacionUnidas.of_codigo as 'OF', 
    vwOrdenesFabricacionUnidas.of_fr_codigo_producto as 'ProductoID', 
    vwOrdenesFabricacionUnidas.of_fecha_alta, 
    tbRegPlantaComun.EstadoID, 
    tbRegPlantaComun.ProcesoEstadoID, 
    tbRegPlantaComun.EnsacadoEstadoID,
    tbRegPlantaComun.ID, 
    tbRegPlantaComun.FechaInicio,
    tbRegPlantaComun.FechaFin,
    tbRegPlantaComun.TipoOFID,
    tbRegPlantaComun.HoraFin,
    tbRegPlantaComun.HoraInicio,
    tbRegPlantaComun.TurnoFinID,
    tbRegPlantaComun.TurnoInicioID,
    tbRegPlantaComun.D1,
    tbRegPlantaComun.D2,
    tbRegPlantaComun.D3,
    tbRegPlantaComun.D4,
    tbRegPlantaComun.D5,
    tbRegPlantaComun.D6

FROM vwOrdenesFabricacionUnidas
LEFT JOIN tbRegPlantaComun 
    ON vwOrdenesFabricacionUnidas.of_codigo COLLATE Modern_Spanish_CI_AS
    = tbRegPlantaComun.OrdenFabricacionID COLLATE Modern_Spanish_CI_AS
ORDER BY vwOrdenesFabricacionUnidas.of_fecha_alta DESC;