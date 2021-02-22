import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  
  constructor(private http:HttpClient) { 


  }

  tomarCiudad(latitud:number,longitud:number){
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=AIzaSyAZooAkDjnn2bF4nrmvqrx3WrdlRBP38Ow`);
  }

  tomarCoordenadas(ciudad:String){
  


    return this.http.get(`https://nominatim.openstreetmap.org/search.php?q=${ciudad}+chile&polygon_geojson=1&format=json`);
  }
  


}
