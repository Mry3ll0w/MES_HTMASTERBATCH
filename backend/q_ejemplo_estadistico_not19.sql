Use MES;
Select * from Datos18.dbo.Tb18
WHere FechaHora BETWEEN '2022-07-22 20:40' AND '2022-07-23 00:16'
AND FechaHora not IN 
    (   Select FechaHora 
        from Datos19.dbo.Tb19
        Where 
            FechaHora BETWEEN '2022-07-22 20:40' AND '2022-07-23 00:16' 
            and 
            valor < 100
    )
and valor > 100
order by FechaHora desc;
