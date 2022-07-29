SELECT 
    MES.dbo.tbRegPlanta.ID,  
    MES.dbo.tbRegPlantaComun.[OrdenFabricacionID] as 'OF'
    ,MES.dbo.tbRegPlantaComun.[ProductoID]
    ,[FechaHoraRegInicio]
    ,[FechaHoraRegFin]
    ,FORMAT(FechaInicio,'yyyy-MM-dd') as FechaInicio
    ,FORMAT(FechaFin,'yyyy-MM-dd') as FechaFin
    ,[HoraInicio]
    ,[HoraFin]
    ,[EnsacadoEstadoID] as Estado
    ,[Observacion],
    MES.dbo.tbRegPlanta.Seleccion,
    MES.dbo.tbRegPlanta.Plasta,
    MES.dbo.tbRegPlanta.Desperdicio,
    Rechazo,
    TurnoID,
    MES.dbo.tbRegPlanta.[RegPlantaComunID]
      
  FROM [MES].[dbo].[tbRegPlantaComun],MES.dbo.tbRegPlanta
  WHERE MES.dbo.tbRegPlantaComun.ID = MES.dbo.tbRegPlanta.RegPlantaComunID
  GROUP BY MES.dbo.tbRegPlanta.ID
  order by ID desc;