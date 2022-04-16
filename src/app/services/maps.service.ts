import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import tt, {
  Popup,
  TomTomAttributionControl,
} from '@tomtom-international/web-sdk-maps';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(public http: HttpClient) { }

  markersList: tt.Marker[] = [];
  map!: tt.Map;

  getAddress(lat: any, lng:any){
    return this.http.get('https://api.tomtom.com/search/2/reverseGeocode/'+lat+'%2C'+lng+'.json?returnSpeedLimit=false&radius=1000&returnRoadUse=false&allowFreeformNewLine=false&returnMatchType=false&view=Unified&key=A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA')
  }

  // getCoordinates(address: any){
  //   return this.http.get('https://api.tomtom.com/search/2/reverseGeocode/'+lat+'%2C'+lng+'.json?returnSpeedLimit=false&radius=1000&returnRoadUse=false&allowFreeformNewLine=false&returnMatchType=false&view=Unified&key=A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA')
  // }

  getMap(){
    return this.map;
  }

  setMap(map: tt.Map){
    this.map = map;
  }

  getMarkersList(){
    return this.markersList;

  }

  setMarkersList(markersList: tt.Marker[]){

    this.markersList = markersList;

  }



}
