import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemParamService {

  constructor() { }

  public SERVER = {
    host: 'http://localhost:8080/TOMAPI/',
    // host: 'https://tomjavaapi.azurewebsites.net/',
    
    listener: 'http://localhost:3000'
  }

}
