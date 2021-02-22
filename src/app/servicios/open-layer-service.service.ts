import { Injectable } from '@angular/core';

import { HttpClient ,HttpParams, HttpHeaders  } from '@angular/common/http';

import Map from 'ol/Map';
import Vector from 'ol/source/Vector';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
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



@Injectable({
  providedIn: 'root'
})
export class OpenLayerServiceService {

  constructor(private http:HttpClient) {

  }


  async getVectorLayer(){

    let data = await this.getGeoJSON("Comunas_Chile")

    console.log(data)
    let vector = new VectorLayer({

      source: new VectorSource({
        
        format: new GeoJSON(),
        url: '/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typename=Proyecto:Comunas_Chile&outputFormat=application/json',
        
      })
    })


    console.log(vector)
  }

  async getGeoJSON(capa){
  
    return this.http.get('/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typename=Proyecto:'+capa+'&outputFormat=application/json').toPromise()
  }
  
}
