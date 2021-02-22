const express = require('express');
const app = express ();
const client = require ('../bdd');
const GeoJSON = require('geojson');





app.get('/getNearestEstablecimientoSalud/:lng/:lat',(req,res)=>{
    let longitud = req.params.lng;
    let latitud = req.params.lat;


    let select_query=`SELECT gid as id, nombre as nombreLocal, comuna_ as comuna, st_distance(geom, st_geometryfromtext('POINT(`+longitud+` `+latitud+`)',4326), true) as distancia, st_x(geom) as lng, st_y(geom ) as lat 
    FROM establecimientos_salud
    order by distancia ASC
    LIMIT 1`

    client.query(select_query,(err,respuesta)=>{
        if (err) {
            console.log(err)
            return res.status(400).json({
                ok: false,
                err
            });
        }else{
            let geojson = GeoJSON.parse(respuesta.rows, { Point: ['lat', 'lng'] });
            if(!respuesta.rows[0]){

                res.json({
                    ok: true,
                    datos: geojson
                });
    
            }else{
                res.json({
                    ok: true,
                    datos: geojson
                });
            }
        }
        
    })
    
})


app.get('/updatePromEstablecimientos/:lon/:lat/:distance', (req, res, next) => {
    let longitud = req.params.lon 
    let latitud = req.params.lat
    let distance_user = req.params.distance

    let select_query= `SELECT *
    FROM comunas
    where st_intersects(st_geometryfromtext('POINT(`+longitud+` `+latitud+`)', 4326),geom)`

    client.query(select_query,(err,respuesta)=>{
        if (err) {
            console.log(err)
            return res.status(400).json({
                ok: false,
                err
            });
        }else{

            var cod_comuna = respuesta.rows[0].cod_comuna

            var n_users_actuales = respuesta.rows[0].n_usuarios_establecimientos
            n_users_actuales = parseInt(n_users_actuales)


            var promedio = respuesta.rows[0].promedio_distancia_establecimientos
            promedio = parseFloat(promedio)

            distance_user = parseFloat(distance_user)

            var new_mean = (n_users_actuales*promedio + distance_user) / (n_users_actuales + 1)

            n_users_actuales = n_users_actuales + 1

            let upd_query = `UPDATE comunas SET n_usuarios_establecimientos=${n_users_actuales}, promedio_distancia_establecimientos=${new_mean} WHERE cod_comuna = ${cod_comuna}`

            client.query(upd_query, (err2, resultados2) => {
                if (err2) {
            
                    console.log(err2);
                    return res.status(400).json({
                        ok: false,
                        error: err2.error
                    });
                }
                res.json({
                    ok: true,
                    response: respuesta.rows
                });
            
            })
            
        }
        
    })


    /*
    const upd_query = `UPDATE farma SET cantidad=${body.cantidad} WHERE 
    mail='${body.mail}' AND id_lista='${body.id_lista}' AND id_tienda='${body.id_tienda}' AND
    nombre_categoria='${body.nombre_categoria}' AND id_producto=${body.id_producto}
    ;`
    client.query(upd_query, (err, resultados) => {

        if (err) {
            
            console.log(err);
            return res.status(400).json({
                ok: false,
                error: err.error
            });
        }

        res.json({
            ok: true,
            response: resultados.rows
        });

    })*/
});






module.exports = app;