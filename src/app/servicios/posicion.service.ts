import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PosicionService {

  constructor(private http: HttpClient) { 

  }

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });

  }

  getFarmaciaCercana(longitud:any, latitud:any){
    return this.http.get(`backend/getNearestDrugStore/${longitud}/${latitud}`)
    
  }
  
  updatePromFarmacia(longitud:any, latitud:any, distance:any){
    return this.http.get(`backend/updatePromFarmacia/${longitud}/${latitud}/${distance}`)
  }


  getEstablecimientoSaludCercano(longitud:any, latitud:any){
    return this.http.get(`backend/getNearestEstablecimientoSalud/${longitud}/${latitud}`)
    
  }

  updatePromEstablecimientos(longitud:any, latitud:any, distance:any){
    return this.http.get(`backend/updatePromEstablecimientos/${longitud}/${latitud}/${distance}`)
  }
  
  /*
  getFarmaciaCercana(longitud:any, latitud:any){
    return this.http.get(`backend/getNearestDrugStore/${longitud}/${latitud}`).toPromise()
    
  }

  updatePromFarmacia(longitud:any, latitud:any, distance:any){
    return this.http.get(`backend/updatePromFarmacia/${longitud}/${latitud}/${distance}`).toPromise()
  }
  */
  getJSON(): Observable<any> {
    return this.http.get("./assets/puntos.json");
  } 

  

}
