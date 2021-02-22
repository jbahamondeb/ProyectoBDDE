const express = require('express');
const app = express ();


const http = require('http')


app.get('/getCapa/:capa',(req,res)=>{



    let capa = req.params.capa;
    /*
    const options = {
        hostname: 'localhost',
        port: 8085,
        path: '/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typename=Proyecto:'+capa+'&outputFormat=application/json',
        method: 'GET'
    }
    */
    var link = 'http://localhost:8085/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typename=Proyecto:'+capa+'&outputFormat=application/json';
    //console.log(link)
    
    http.get(link, (res2) => {

        
       
        let body = "";
        res2.on("data", (chunk) => {
          //process.stdout.write(d)
          //res.send(d)
          body += chunk;
          //console.log(chunk)
          //console.log(`BODY: ${d}`);
          //console.log(`${arrayJson}`)
        })

        res2.on("end", () => {
            try {
                let json = JSON.parse(body);
                console.log("Final")
                res.json(json)
                
                
            } catch (error) {
                console.error(error.message);
            };
        });
      }).on('error', error => {
        console.error(error)
      })    
});


module.exports = app;