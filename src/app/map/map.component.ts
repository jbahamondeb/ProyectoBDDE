import { ChangeDetectionStrategy,Component, OnInit,ChangeDetectorRef,ViewChild,ElementRef, NgZone} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';


import Map from 'ol/Map';
import Feature from 'ol/feature'
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text'
import Icon from 'ol/style/Icon';
import GeoJSON from 'ol/format/GeoJSON';
import * as olProj from 'ol/proj';
import {Group as LayerGroup, Tile as TileLayer} from 'ol/layer';
import SourceOSM from 'ol/source/OSM';
import {Fill, Stroke} from 'ol/style';

import LayerSwitcher from 'ol-layerswitcher';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';
import OSM from 'ol/source/OSM';


import Overlay from 'ol/Overlay';



import {click, pointerMove} from 'ol/events/condition';
import {Draw, Modify, Select, Snap} from 'ol/interaction';


import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';

import {PosicionService} from 'src/app/servicios/posicion.service'
import LineString from 'ol/geom/LineString';

import Group from 'ol/layer/Group'

import Tile from 'ol/layer/Tile'
import Geocoder from 'ol-geocoder';
import TileWMS from 'ol/source/TileWMS'


import Swal from 'sweetalert2'

import * as turf from '@turf/turf';





@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
  panelOpenState = false;

  panelOpenState2 = false;

  panelOpenState3 = false;

  map: any;
  options: any;


  vector:any;

  private data : any;
  json: any;

  colors : string[] = []

  categoriasNumeros: Array<String> = [];
  categoriasIndices: Array<String> = [];
  categoriasComparar: Array<String> = [];

  lat_ubicacion: any;
  lon_ubicacion:any;


  markerLayerPosition: any;

  iconoPosicion:any;


  markerLayerQuery:any;
  markerLayerQuery2:any;

  iconoQuery:any;
  iconoQuery2:any;

  lat_query:any;
  lon_query:any;

  lineBetweenPositionAndQuery:any;

  datos:any;
  

  puntos:any;

  isLoading = true;

  vectorLayer: any;

  vectorLayer2: any;



  vectorLayerIsocrona1: any;
  vectorLayerIsocrona2: any;
  vectorLayerIsocrona3: any;
  vectorLayerIsocrona4: any;


  indicadores: boolean;
  indicadorSeleccionado: string;

  attributo: string;


  comparar = false;


  container:any
  content:any
  closer:any
  popup:any;

  overlay:any

  isocronas:boolean;


  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private http: HttpClient,private cdr:ChangeDetectorRef, private position: PosicionService, public dialog: MatDialog) {

    this.indicadores = false;
    this.indicadorSeleccionado = "";
    this.categoriasNumeros = []
    this.categoriasIndices = []
    this.categoriasComparar = []

    this.colors = []


    this.isocronas = false;
    this.markerLayerPosition = new VectorLayer({
      source: new VectorSource({
          features: [

          ]
      }),
      
    });

    this.markerLayerQuery = new VectorLayer({
      source: new VectorSource({
          features: [

          ]
      })
    });

    this.markerLayerQuery2 = new VectorLayer({
      source: new VectorSource({
          features: [

          ]
      })
    });

    this.iconoPosicion = new Style({
      image:  new Icon({
        crossOrigin: 'anonymous',
        src: 'assets/marker.png',
        size : [512,512],
        scale: 0.08
      })

    })

    this.iconoQuery = new Style({
      image:  new Icon({

        crossOrigin: 'anonymous',
        src: 'assets/pharmacy.png',
        size : [512,512],
        scale: 0.08

      })

    })

    this.iconoQuery2 = new Style({
      image:  new Icon({

        crossOrigin: 'anonymous',
        src: 'assets/hospital.png',
        size : [512,512],
        scale: 0.08

      })

    })



    this.vectorLayer = new VectorLayer({
      
      source: new VectorSource({
        
      })
    })

    this.vectorLayer2 = new VectorLayer({
      
      source: new VectorSource({
        
      })
    })

    this.vectorLayerIsocrona1 = new VectorLayer({
      
      source: new VectorSource({
        
      })
    })

    this.vectorLayerIsocrona2 = new VectorLayer({
      
      source: new VectorSource({
        
      })
    })
    this.vectorLayerIsocrona3 = new VectorLayer({
      
      source: new VectorSource({
        
      })
    })
    this.vectorLayerIsocrona4 = new VectorLayer({
      
      source: new VectorSource({
        
      })
    })
    this.lineBetweenPositionAndQuery = new VectorLayer({
        style: new Style({
          fill: new Fill({ color: '#0000ff'}),
          stroke: new Stroke({ color: '#0000ff', width: 5 })
      })
    });



    
   
  }

  async ngOnInit() {




    this.isLoading = false;



    const osm = new TileLayer({
      type: 'base',
      visible: true,
      source: new SourceOSM()
    }as BaseLayerOptions);

    osm.set('title', 'OpenStreetMap');


    const firstLayer = new VectorLayer({

      visible: false,
      source:  new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:establecimientos_salud&'+
                  'outputFormat=application/json';
        },
        
      })
    });

    firstLayer.setStyle(this.iconoQuery2)

    firstLayer.setZIndex(1000);

    firstLayer.set('title', 'Establecimientos de Salud');


    
    const secondLayer = new VectorLayer({

      visible: false,
      source:  new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:Farmacias_reproyectadas&'+
                  'outputFormat=application/json';
        },
        
      })
    });

    secondLayer.set('title', 'Farmacias');

    secondLayer.setStyle(this.iconoQuery)

    secondLayer.setZIndex(1001);
    
    this.map = new Map({
      target: 'map',
      layers: [osm,firstLayer, secondLayer],
        
      
      view: new View({
        center: olProj.fromLonLat([-71.542969,-35.675147]),
        zoom: 8
      })
    });

    var layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'group'
    });
    

    this.map.addControl(layerSwitcher);

    var geocoder = new Geocoder('nominatim', {
      provider: 'osm',
      lang: 'en',
      placeholder: 'Buscar comuna ...',
      limit: 5,
      keepOpen: true,
      
    });
    this.map.addControl(geocoder);

    

    var selectClick = new Select({
      condition: click,
      style: function(feature) {


        var clase = feature.get('clase')
        if(clase == 0){
          var estilo = new Style({
            fill: new Fill({
              color: [155,155,155,25]
            }),
            stroke: new Stroke({
              color: '#0000FF',
              width: 4
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }else if(clase == 1){
          var estilo = new Style({
            fill: new Fill({
              color: [247,251,255,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#0000FF',
              width: 4
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
    
          })
    
          
        }else if(clase == 2){
          var estilo = new Style({
            fill: new Fill({
              color: [200,221,240,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#0000FF',
              width: 4
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }else if(clase == 3){
          var estilo = new Style({
            fill: new Fill({
              color: [115,179,216,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#0000FF',
              width: 4
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }else if(clase == 4){
          var estilo = new Style({
            fill: new Fill({
              color: [40,121,185,255] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#0000FF',
              width: 4
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })
        }else if(clase == 5){
          var estilo = new Style({
            fill: new Fill({
              color: [8,48,107,255] 
            }),
            stroke: new Stroke({
              color: '#0000FF',
              width: 4
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
        
        return estilo
      }
        
    });



    this.map.addInteraction(selectClick);
    
    selectClick.on('select', (e) => {


      if(this.comparar == true){
          e.selected.forEach((e)=>{
            
            this.paintMapDinamic(e.get(this.attributo), this.attributo, e.get('cod_comuna'))

          })
      }else{
        e.selected.forEach((e)=>{
          window.alert(e.get("Comuna") + "\n" + e.get(this.attributo))
        })
      }
        
    })
    


  }
  

 async paintMap(capa, atributo, indicador){
   
  
  this.map.removeLayer(this.vectorLayerIsocrona1)
  this.map.removeLayer(this.vectorLayerIsocrona2)
  this.map.removeLayer(this.vectorLayerIsocrona3)
  this.map.removeLayer(this.vectorLayerIsocrona4)

  this.vectorLayer.setVisible(true)
  this.indicadores = true;
  this.isocronas = false;



  this.comparar = false;
  
  if(indicador != this.indicadorSeleccionado){
    this.indicadorSeleccionado = indicador
  }

 

  this.attributo = atributo

 


  

  this.map.getView().setZoom(8)
  this.map.getView().setCenter(olProj.fromLonLat([-71.542969,-35.675147]))

  this.map.removeLayer(this.vectorLayer)
  this.map.removeLayer(this.vectorLayer2)

  this.isLoading = true;
  
  this.rellenarColores("indice")
  
  this.setSourceVectors(capa)
  
  this.map.addLayer(this.vectorLayer)

  var datos = this.vectorLayer.getSource()

  this.cargarEstiloCoropletico(datos)



  this.map.addLayer(this.vectorLayer2)

  var datos2 = this.vectorLayer2.getSource()

  this.cargarEstiloCoropletico2(datos2)

 

  


    

  } 



  rellenarColores(tipo){
    this.colors = []
  
    if(this.comparar == true && tipo=="comparar"){

      
      this.categoriasComparar = []
      
      for(let i=0;i<5;i++){
        this.categoriasComparar.push("0")
      }
  
  
      this.categoriasComparar[0] = ">x2"
      this.categoriasComparar[1] = "<=x2"
      this.categoriasComparar[2] = "x1"
      this.categoriasComparar[3] = ">=x0.5"
      this.categoriasComparar[4] = "<x0.5"

      this.categoriasComparar.push("Sin datos.")
  
  
  
      this.colors.push("rgba(0,142,28,1)") // verde oscuro
      this.colors.push("rgba(96,255,128,1)") // verde
      this.colors.push("rgba(8,48,107,255)") // azul
      this.colors.push("rgba(255,117,117,1)") // rojo claro
      this.colors.push("rgba(239,0,0,1)") // rojo oscuro  
      this.colors.push("rgba(155,155,155,25)") // gris
    }else if(tipo=="indice"){
      for(let i=0;i<5;i++){
        this.categoriasIndices.push("0")
      }
  
      this.colors.push("rgba(247,251,255,255)")
      this.colors.push("rgba(200,221,240,255)")
      this.colors.push("rgba(115,179,216,255)")
      this.colors.push("rgba(40,121,185,255)")
      this.colors.push("rgba(8,48,107,255)")
      this.colors.push("rgba(155,155,155,25)")
    }else if(tipo=="isocrona"){
   
      for(let i=0;i<5;i++){
        this.categoriasIndices.push("0")
      }
  
      this.colors.push("rgba(0,71,236,255)")
      this.colors.push("rgba(80,18,123,255)")
      this.colors.push("rgba(182,54,121,255)")
      this.colors.push("rgba(252,135,97,255)")

      console.log(this.colors)

    }
    
  }

  setSourceVectors(capa: any){


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
      this.vectorLayer2 = new VectorLayer({
    
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
    

   


  
  }

  cargarEstiloCoropletico(datos:any){
    this.vectorLayer.set('name','indicador')
    this.categoriasIndices = []
    var dictLeyendas = new Array();
    datos.once('change', () => {
    
      datos.forEachFeature(function (feature){

      
        var clase = feature.get('clase')
        var leyenda = feature.get('leyenda')
        var indice_leyenda = feature.get('indice_ley')

        
        if(leyenda != ""){
          
          //setLeyendas.add({leyenda_texto: leyenda, indice_leyenda_number: indice_leyenda});
          dictLeyendas[indice_leyenda] = leyenda
        }

        if(clase==1){
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
            }),

          })
          
          
        }else if(clase==2){
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
        }else if(clase==3){
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
        }else if(clase==4){
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
          
        }else if(clase==5){
          var estilo = new Style({
            fill: new Fill({
              color: [8,48,107,255] 
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
        }else if(clase==0){

          
          var estilo = new Style({
            fill: new Fill({
              color: [155,155,155,25]
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
        }


        
        feature.setStyle(estilo)
      });
    



    



    this.vectorLayer.getSource().changed();

    for(let i =0;i<dictLeyendas.length;i++){
      
      if(i!=dictLeyendas.length-1){
        this.categoriasIndices[i] = "[" + dictLeyendas[i] + "["
      }else{
        this.categoriasIndices[i] = "[" + dictLeyendas[i] + "]"
      }

      
    }

  
    
    this.categoriasIndices.push("Sin datos.")


    this.isLoading = false
    this.cdr.detectChanges()

    
    });
  }

  cargarEstiloCoropletico2(datos:any){
    this.vectorLayer2.set('name','comparar')
    datos.once('change', () => {
    
      datos.forEachFeature(function (feature){

      
        var clase = feature.get('clase')
        if(clase==1){
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
          
          
        }else if(clase==2){
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
        }else if(clase==3){
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
        }else if(clase==4){
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
          
        }else if(clase==5){
          var estilo = new Style({
            fill: new Fill({
              color: [8,48,107,255] 
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
        }else if(clase==0){

          
          var estilo = new Style({
            fill: new Fill({
              color: [155,155,155,25]
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
        }


        
        feature.setStyle(estilo)
      });
    



    



    this.vectorLayer2.getSource().changed();
    this.vectorLayer2.setVisible(false)
  
    this.isLoading = false
    this.cdr.detectChanges()

    
    });
  }


  cargarEstiloCoropletico3(datos:any){
    
    

    

  }
  paintMapDinamic(valorSeleccionado, campoAComparar, cod_comuna){

    var datos = this.vectorLayer2.getSource()




    datos.forEachFeature(function (feature){

      
        var attrAComparar = feature.get(campoAComparar)
        var cod_comuna_comparar = feature.get('Comuna')

        if(cod_comuna == cod_comuna_comparar){
          var estilo = new Style({
            fill: new Fill({
              color: [237,255,33,255]
            }),
            stroke: new Stroke({
              color: '#E5BE01',
              width: 4
            }),
            text: new Text({
              text: feature.get("Comuna"),
              font: '11px roboto,sans-serif',
              fill: new Fill({
                color: 'orange'
              }),
            })
          })  
        }else if(attrAComparar != null){
          if(attrAComparar > 2 * valorSeleccionado){
            var estilo = new Style({
              fill: new Fill({
                color: [0,142,28,1] 
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
          }else if(valorSeleccionado < attrAComparar && attrAComparar <=  2*valorSeleccionado){
            var estilo = new Style({
              fill: new Fill({
                color: [96,255,128,1] 
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
          }else if(valorSeleccionado > attrAComparar && attrAComparar >=  0.5*valorSeleccionado){
            var estilo = new Style({
              fill: new Fill({
                color: [255,117,117,1] 
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
          }else if(attrAComparar < 0.5* valorSeleccionado){
            var estilo = new Style({
              fill: new Fill({
                color: [239,0,0,1] 
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
          }else if(attrAComparar == valorSeleccionado){
            var estilo = new Style({
              fill: new Fill({
                color: [8,48,107,255] 
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
          }
          

          
        }else{
          var estilo = new Style({
            fill: new Fill({
              color: [155,155,155,25]
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
          
        }
        feature.setStyle(estilo)
        
    });


    var datos2 = this.vectorLayer.getSource()

    //this.map.removeLayer(this.vectorLayer)

  }

  chargeisocronas(){  

    this.comparar = false;
    this.map.removeLayer(this.vectorLayerIsocrona1)
    this.map.removeLayer(this.vectorLayerIsocrona2)
    this.map.removeLayer(this.vectorLayerIsocrona3)
    this.map.removeLayer(this.vectorLayerIsocrona4)
    
    this.indicadores = true;
    this.isocronas = true;

    this.map.getView().setZoom(10)
    this.map.getView().setCenter(olProj.fromLonLat([-70.6653,-33.4513]))

    this.map.removeLayer(this.vectorLayer)
    this.map.removeLayer(this.vectorLayer2)

    this.isLoading = true;

    this.rellenarColores("isocrona")


    this.vectorLayerIsocrona1 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaFarmacia20&'+
                  'outputFormat=application/json';
        },
        
      })
    })


    this.vectorLayerIsocrona2 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaFarmacia15&'+
                  'outputFormat=application/json';
        },
        
      })
    })

    this.vectorLayerIsocrona3 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaFarmacia10&'+
                  'outputFormat=application/json';
        },
        
      })
    })

    this.vectorLayerIsocrona4 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaFarmacia5&'+
                  'outputFormat=application/json';
        },
        
      })
    })

    this.vectorLayer.setVisible(false)
    
    this.map.addLayer(this.vectorLayerIsocrona1)
    this.map.addLayer(this.vectorLayerIsocrona2)
    this.map.addLayer(this.vectorLayerIsocrona3)
    this.map.addLayer(this.vectorLayerIsocrona4)

    

    this.categoriasIndices = []
    this.categoriasIndices.push("[0 - 5 min[")
    this.categoriasIndices.push("[5 - 10 min[")
    this.categoriasIndices.push("[10 - 15 min[")
    this.categoriasIndices.push("[15 - 20 min]")  


    
    var datos = this.vectorLayerIsocrona1.getSource()
    this.vectorLayerIsocrona1.set('name','isocronas1')


      datos.once('change', () => {
        datos.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [252,135,97,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona1.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })
    
    var datos2 = this.vectorLayerIsocrona2.getSource()
    this.vectorLayerIsocrona2.set('name','isocronas2')
      datos2.once('change', () => {
        datos2.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [182,54,121,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),

          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona2.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })
    
    var datos3 = this.vectorLayerIsocrona3.getSource()
    this.vectorLayerIsocrona3.set('name','isocronas3')
      datos3.once('change', () => {
        datos3.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [80,18,123,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),

          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona3.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })
    
    var datos4 = this.vectorLayerIsocrona4.getSource()
    this.vectorLayerIsocrona4.set('name','isocronas4')
      datos4.once('change', () => {
        datos4.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [80,18,123,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),

          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona4.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })

  
  } 


  chargeisocronas2(){  

    this.comparar = false;
    this.map.removeLayer(this.vectorLayerIsocrona1)
    this.map.removeLayer(this.vectorLayerIsocrona2)
    this.map.removeLayer(this.vectorLayerIsocrona3)
    this.map.removeLayer(this.vectorLayerIsocrona4)
    this.indicadores = true;
    this.isocronas = true;

    this.map.getView().setZoom(10)
    this.map.getView().setCenter(olProj.fromLonLat([-70.6653,-33.4513]))

    this.map.removeLayer(this.vectorLayer)
    this.map.removeLayer(this.vectorLayer2)

    this.isLoading = true;

    this.rellenarColores("isocrona")


    this.vectorLayerIsocrona1 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaServicioSalud20&'+
                  'outputFormat=application/json';
        },
        
      })
    })


    this.vectorLayerIsocrona2 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaServicioSalud15&'+
                  'outputFormat=application/json';
        },
        
      })
    })

    this.vectorLayerIsocrona3 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaServicioSalud10&'+
                  'outputFormat=application/json';
        },
        
      })
    })

    this.vectorLayerIsocrona4 = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:IsocronaServicioSalud5&'+
                  'outputFormat=application/json';
        },
        
      })
    })

    this.vectorLayer.setVisible(false)
    
    this.map.addLayer(this.vectorLayerIsocrona1)
    this.map.addLayer(this.vectorLayerIsocrona2)
    this.map.addLayer(this.vectorLayerIsocrona3)
    this.map.addLayer(this.vectorLayerIsocrona4)

    

    this.categoriasIndices = []
    this.categoriasIndices.push("[0 - 5 min[")
    this.categoriasIndices.push("[5 - 10 min[")
    this.categoriasIndices.push("[10 - 15 min[")
    this.categoriasIndices.push("[15 - 20 min]")  


    
    var datos = this.vectorLayerIsocrona1.getSource()
    this.vectorLayerIsocrona1.set('name','isocronas1')


      datos.once('change', () => {
        datos.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [252,135,97,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),
          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona1.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })
    
    var datos2 = this.vectorLayerIsocrona2.getSource()
    this.vectorLayerIsocrona2.set('name','isocronas2')
      datos2.once('change', () => {
        datos2.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [182,54,121,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),

          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona2.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })
    
    var datos3 = this.vectorLayerIsocrona3.getSource()
    this.vectorLayerIsocrona3.set('name','isocronas3')
      datos3.once('change', () => {
        datos3.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [80,18,123,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),

          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona3.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })
    
    var datos4 = this.vectorLayerIsocrona4.getSource()
    this.vectorLayerIsocrona4.set('name','isocronas4')
      datos4.once('change', () => {
        datos4.forEachFeature(function (feature){
          var estilo = new Style({
            fill: new Fill({
              color: [80,18,123,0.5] // semi-transparent red
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1
            }),

          })

         

          feature.setStyle(estilo)
        })

        this.vectorLayerIsocrona4.getSource().changed();
        this.cdr.detectChanges()
        this.isLoading = false;
      })

  
  } 


  farmacia(){

    this.map.removeLayer(this.vectorLayerIsocrona1);
    this.map.removeLayer(this.vectorLayerIsocrona2);
    this.map.removeLayer(this.vectorLayerIsocrona3);
    this.map.removeLayer(this.vectorLayerIsocrona4);
    this.indicadores = false;

    
    this.map.removeLayer(this.vectorLayer)
    this.map.removeLayer(this.vectorLayer2)
    this.map.removeLayer(this.iconoPosicion)
    this.map.removeLayer(this.iconoQuery)
    this.map.removeLayer(this.iconoQuery2)
    this.map.removeLayer(this.markerLayerQuery)
    this.map.removeLayer(this.markerLayerPosition)
    this.map.removeLayer(this.markerLayerQuery2)
    this.map.removeLayer(this.lineBetweenPositionAndQuery)
  

    this.isLoading = true
    this.cdr.detectChanges()
    this.position.getPosition().then(pos=>
    {   


          //this.lon_ubicacion = pos.lng
          //this.lat_ubicacion = pos.lat 

          this.lon_ubicacion = -72.985950
          this.lat_ubicacion = -41.317826

        this.addMarker(this.lon_ubicacion, this.lat_ubicacion, "posicion")

        this.position.getFarmaciaCercana(this.lon_ubicacion, this.lat_ubicacion).subscribe((resp:any)=>{
          console.log(resp)
          this.isLoading = false
          this.cdr.detectChanges()
          this.datos = resp;
          

          var distancia = resp.datos.features[0].properties.distancia
          this.lon_query = resp.datos.features[0].geometry.coordinates[0]
          this.lat_query = resp.datos.features[0].geometry.coordinates[1]

          this.addMarker(this.lon_query, this.lat_query, "farmacia")

          this.position.updatePromFarmacia(this.lon_ubicacion, this.lat_ubicacion, distancia).subscribe((resp2:any)=>{



            var promedio_actual_comuna = resp2.response[0].promedio_distancia_farmacias
            var n_usuarios_farmacias = resp2.response[0].n_usuarios_farmacias
            var texto = ""
            distancia = parseFloat(distancia)
            promedio_actual_comuna = parseFloat(promedio_actual_comuna)
            
            var diferencia = Math.abs(distancia-promedio_actual_comuna).toFixed(4)
            var diferencia2 = parseFloat(diferencia)
            diferencia2 = diferencia2/1000;

           
            if(distancia < promedio_actual_comuna){


              texto = texto + " Estás <b>" + diferencia2.toFixed(4) + "kms.</b>  más cerca de una Farmacia que el promedio de tu Comuna."
            }else{
              
              texto = texto + " Estás <b>" + diferencia2.toFixed(4) + "kms.</b>  más lejos de una Farmacia que el promedio de tu Comuna."
            }
            distancia = distancia/1000;
            distancia = distancia.toFixed(4)

            promedio_actual_comuna = promedio_actual_comuna/1000;
            promedio_actual_comuna = promedio_actual_comuna.toFixed(4)
            
            var texto2 = "<br><br>El número de usuarios que hicieron está consulta son : <b> " + n_usuarios_farmacias + "</b>"
            if(parseFloat(distancia) > parseFloat(promedio_actual_comuna)){
              Swal.fire({
                title: "Proximidad de Farmacia", 
                html: 'La farmacia más cercana está a ' + '<b>' +distancia + " kms. </b>" + "<br> " + texto + texto2,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                },
                imageUrl: "https://www.iconpacks.net/icons/2/free-sad-face-icon-2691-thumb.png",
                confirmButtonText: 'Entendido!',
                confirmButtonColor: '#0253ab',
                imageWidth: 200,
                imageHeight: 200,
               
              
              })
            }else {
              Swal.fire({
                title: "Proximidad de Farmacia", 
                html: 'La farmacia más cercana está a ' + '<b>' +distancia + " kms. </b>" + "<br> " + texto + texto2,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                },
                imageUrl: "https://image.flaticon.com/icons/png/512/42/42877.png",
                imageWidth: 200,
                imageHeight: 200,
                confirmButtonText: 'Entendido!',
                confirmButtonColor: '#0253ab',
                
              })
            }
            
          })

          

          
        },(err:any)=>{
    
        })
      

        
    });

    


  }
  
  establecimiento(){

   
    this.indicadores = false;

    this.map.removeLayer(this.vectorLayer)
    this.map.removeLayer(this.vectorLayer2)
    this.map.removeLayer(this.iconoPosicion)
    this.map.removeLayer(this.iconoQuery)
    this.map.removeLayer(this.iconoQuery2)
    this.map.removeLayer(this.markerLayerQuery)
    this.map.removeLayer(this.markerLayerPosition)
    this.map.removeLayer(this.markerLayerQuery2)
    this.map.removeLayer(this.lineBetweenPositionAndQuery)

   
    this.isLoading = true
    this.cdr.detectChanges()
    this.position.getPosition().then(pos=>
    {   


          this.lon_ubicacion = pos.lng
          this.lat_ubicacion = pos.lat 

          //this.lon_ubicacion = -72.970379
          //this.lat_ubicacion = -41.468480
        

        this.addMarker(this.lon_ubicacion, this.lat_ubicacion, "posicion")

        this.position.getEstablecimientoSaludCercano(this.lon_ubicacion, this.lat_ubicacion).subscribe((resp:any)=>{
          this.isLoading = false
          this.cdr.detectChanges()
          this.datos = resp;
          

          var distancia = resp.datos.features[0].properties.distancia
          this.lon_query = resp.datos.features[0].geometry.coordinates[0]
          this.lat_query = resp.datos.features[0].geometry.coordinates[1]

          this.addMarker(this.lon_query, this.lat_query, "salud")

          this.position.updatePromEstablecimientos(this.lon_ubicacion, this.lat_ubicacion, distancia).subscribe((resp2:any)=>{

            

            var promedio_actual_comuna = resp2.response[0].promedio_distancia_establecimientos
            var n_usuarios_establecimientos = resp2.response[0].n_usuarios_establecimientos
            var texto = ""
            distancia = parseFloat(distancia)
            promedio_actual_comuna = parseFloat(promedio_actual_comuna)
            
            var diferencia = Math.abs(distancia-promedio_actual_comuna).toFixed(4)
            var diferencia2 = parseFloat(diferencia)
            diferencia2 = diferencia2/1000;

            
           
            if(distancia < promedio_actual_comuna){

              
            

              texto = texto + " Estás <b>" + diferencia2.toFixed(4) + "kms.</b>  más cerca de un Establecimiento de Salud que el promedio de tu Comuna."
            }else{
              
              texto = texto + " Estás <b>" + diferencia2.toFixed(4) + "kms.</b>  más lejos de un Establecimiento de Salud que el promedio de tu Comuna."
            }
            distancia = distancia/1000;
            distancia = distancia.toFixed(4)

            promedio_actual_comuna = promedio_actual_comuna/1000;
            promedio_actual_comuna = promedio_actual_comuna.toFixed(4)
            
            var texto2 = "<br><br>El número de usuarios que hicieron está consulta son : <b> " + n_usuarios_establecimientos + "</b>"

            
            if(distancia > promedio_actual_comuna){
              Swal.fire({
                title: "Proximidad de Establecimientos de Salud", 
                html: 'El Establecimiento de Salud más cercano está a ' + '<b>' +distancia + " kms. </b>" + "<br> " + texto + texto2,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                },
                imageUrl: "https://www.iconpacks.net/icons/2/free-sad-face-icon-2691-thumb.png",
                confirmButtonText: 'Entendido!',
                confirmButtonColor: '#0253ab',
                imageWidth: 200,
                imageHeight: 200,
               
              
              })
            }else {
              Swal.fire({
                title: "Proximidad de Establecimientos de Salud", 
                html: 'El Establecimiento de Salud más cercano está a ' + '<b>' +distancia + " kms. </b>" + "<br> " + texto + texto2,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                },
                imageUrl: "https://image.flaticon.com/icons/png/512/42/42877.png",
                imageWidth: 200,
                imageHeight: 200,
                confirmButtonText: 'Entendido!',
                confirmButtonColor: '#0253ab',
                
              })
            }
            
          })

          

          
        },(err:any)=>{
    
        })
      

        
    });


  }
  
  
  addMarker(longitud:any, latitud:any, icono: string){

    if(icono == "posicion"){
      this.markerLayerPosition = new VectorLayer({
        source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(fromLonLat([longitud, latitud]))
              })
            ]
        })
      });
      this.markerLayerPosition.setStyle(this.iconoPosicion)
      this.map.addLayer(this.markerLayerPosition);

      return
    }else if(icono == "farmacia"){
      this.markerLayerQuery = new VectorLayer({
        source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(fromLonLat([longitud, latitud]))
              })
            ]
        })
      });
      this.markerLayerQuery.setStyle(this.iconoQuery)
      this.map.addLayer(this.markerLayerQuery);
    }else if(icono == "salud"){
      this.markerLayerQuery2 = new VectorLayer({
        source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(fromLonLat([longitud, latitud]))
              })
            ]
        })
      });
      this.markerLayerQuery2.setStyle(this.iconoQuery2)
      this.map.addLayer(this.markerLayerQuery2);
    }
        
    var meanLat = 1;
    var meanLon = 1
    meanLat = (this.lat_query + this.lat_ubicacion)/2;
    meanLon = (this.lon_query + this.lon_ubicacion)/2;
    var lonlat1 = fromLonLat([this.lon_ubicacion, this.lat_ubicacion]);
    var lonlat2 = fromLonLat([this.lon_query, this.lat_query]);
    var linea = new LineString([lonlat1, lonlat2])
      

      this.lineBetweenPositionAndQuery = new VectorLayer({
        source: new VectorSource({
            features: [
              new Feature({
                geometry: linea
              })
            ]
        }),
        style: new Style({
          fill: new Fill({ color: '#0000ff'}),
          stroke: new Stroke({ color: '#0000ff', width: 5 })
        })
      });
      
      this.map.addLayer(this.lineBetweenPositionAndQuery)

      var lonlat = fromLonLat([meanLon, meanLat])
      
      this.map.setView(new View({
        center: lonlat,
        zoom: 15
      }))

      //layer.getSource().changed();
    

    
  }


  activar(event){

    if(event.checked == true){
      
      this.comparar = true
      this.rellenarColores("comparar")

      
      this.vectorLayer.setVisible(false)

      this.vectorLayer2.setVisible(true)
      
    }else{
      this.comparar = false
      this.rellenarColores("indice")
      this.vectorLayer2.setVisible(false)
      this.vectorLayer.setVisible(true)
      
    }
  }




   


  
  
}
