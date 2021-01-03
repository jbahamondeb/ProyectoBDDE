import { ChangeDetectionStrategy,Component, OnInit, ViewChild, ElementRef, AfterViewInit,ChangeDetectorRef} from '@angular/core';
import  * as L from 'leaflet';
import { HttpClient ,HttpParams, HttpHeaders  } from '@angular/common/http';
import {OpenLayerServiceService} from 'src/app/servicios/open-layer-service.service'



import Map from 'ol/Map';
import Vector from 'ol/source/Vector';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text'
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import {Fill, RegularShape, Stroke} from 'ol/style';
import Control from 'ol/control/Control';
import {unByKey} from 'ol/Observable';
import {WFS} from 'ol/format'
import {GML} from 'ol/format';
import Select from 'ol/interaction/Select';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {


  map: any;
  options: any;


  vector:any;

  private data : any;
  json: any;

  colors : string[] = []
  //categorias : string[] = []

  categoriasNumeros: Array<String> = [];

  constructor(private http: HttpClient, private openLayerService: OpenLayerServiceService,private cdr:ChangeDetectorRef) {
    
    this.categoriasNumeros = []
    this.colors = []

   
  }

  async ngOnInit() {

    this.map = new Map({
      target: 'map',
      layers: [],
      view: new View({
        center: olProj.fromLonLat([-71.542969,-35.675147]),
        zoom: 8
      })
    });
    this.paintMap("Farmacias_Comuna", "NUM_FARM")

    var selectClick = new Select({
      condition: click,
    });


    this.map.addInteraction(selectClick);
    selectClick.on('select', function (e) {
        console.log(e.target.getFeatures().getLength())
        e.target.getFeatures().forEach(function(feature) {
          alert('Selected ' + feature.get("Comuna"));
        });
    });

  }

  paintMap(capa, atributo){
    this.colors = []
    this.categoriasNumeros = []

    this.colors.push("rgba(247,251,255,255)")
    this.colors.push("rgba(200,221,240,255)")
    this.colors.push("rgba(115,179,216,255)")
    this.colors.push("rgba(40,121,185,255)")
    this.colors.push("rgba(8,48,107,255)")
    
    let url2 = '/geoserver/ows?' +
    'service=WFS&' +
    'version=2.0.0&request=GetFeature&typename=Proyecto:'+capa+'&'+
    'outputFormat=application/json'

    let vector = new VectorLayer({
      
      source: new VectorSource({
        
        format: new GeoJSON(),
        url: function(extent) {
          console.log("ETRNAAA")
          
          return  '/geoserver/ows?' +
                  'service=WFS&' +
                  'version=2.0.0&request=GetFeature&typename=Proyecto:'+capa+'&'+
                  'outputFormat=application/json';
        },
        
      })
    })

    this.map.addLayer(vector)

    var datos = vector.getSource()
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
      console.log(this.categoriasNumeros)


      //this.change.detectChanges();
      

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
      vector.getSource().changed();
      //this.map.addLayer(vector)
      
    });


    

    //console.log(datos.getFeatures())
    
  }




}
