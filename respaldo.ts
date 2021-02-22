/*
  async paintMap(capa, atributo){

    this.indicadores = true;

    this.map.getView().setZoom(8)
    this.map.getView().setCenter(olProj.fromLonLat([-71.542969,-35.675147]))

    this.map.removeLayer(this.vectorLayer)
    this.isLoading = true;
    

    this.colors = []
    this.categoriasNumeros = []

    this.colors.push("rgba(247,251,255,255)")
    this.colors.push("rgba(200,221,240,255)")
    this.colors.push("rgba(115,179,216,255)")
    this.colors.push("rgba(40,121,185,255)")
    this.colors.push("rgba(8,48,107,255)")
    

    this.vectorLayer = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:'+capa+'&'+
                  'outputFormat=application/json';
        },
        
      })
    })
    

    this.map.addLayer(this.vectorLayer)

    var datos = this.vectorLayer.getSource()

    datos.once('change', () => {
      
      var max = -1
      var len = datos.getFeatures().length
      datos.forEachFeature( (feature)=>{
        if (max < feature.get(atributo)){
          max = feature.get(atributo)
          
        }
      });

      var diferencia_entre_intervalos = max/5

      var suma_anterior = 0
      var suma = 0
      var intervalos : Number[] = []
      var categorias : String[] = []
      for(var i=0;i<5;i++){
     
        suma_anterior = suma
        suma+= diferencia_entre_intervalos
        intervalos.push(suma)
        var redondeado2 = Math.round(suma_anterior)
        var redondeado = Math.round(suma)
        var string = redondeado2.toString() + " - " + redondeado.toString()
        categorias.push(string)
        this.categoriasNumeros.push(string)
        this.cdr.detectChanges()
        
        
      }
      
      

      datos.forEachFeature(function (feature){
        
        var largo = feature.get(atributo)

        if(largo<intervalos[0]){
          var estilo = new Style({
            fill: new Fill({
              color: [247,251,255,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
          
          
        }else if(largo<intervalos[1]){
          var estilo = new Style({
            fill: new Fill({
              color: [200,221,240,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }else if(largo<intervalos[2]){
          var estilo = new Style({
            fill: new Fill({
              color: [115,179,216,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }else if(largo<intervalos[3]){
          var estilo = new Style({
            fill: new Fill({
              color: [40,121,185,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
          
        }else if(largo<=intervalos[4]){
          var estilo = new Style({
            fill: new Fill({
              color: [8,48,107,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }else{
          var estilo = new Style({
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }


        
        feature.setStyle(estilo)
      });



      
      
      //datos.refresh()


      this.vectorLayer.getSource().changed();
      this.isLoading = false;
      this.cdr.detectChanges()
      
      
      

      
      
      //this.map.addLayer(vector)
      
    });

 

    

    

    
  }
  */