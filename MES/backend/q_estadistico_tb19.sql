
Select * from Datos19.dbo.tb19
WHere
    valor > 100
    AND
    FechaHora BETWEEN '2022-07-27 19:26' AND '2022-07-27 20:47'
order by FechaHora desc;