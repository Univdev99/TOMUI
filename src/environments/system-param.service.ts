import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemParamService {

  constructor() { }

  public SERVER = {
    // host: 'http://ec2-34-215-156-237.us-west-2.compute.amazonaws.com/api/TOMAPI/',
    host: 'http://localhost:8000/TOMAPI/',
    // host: 'https://tomjavaapi.azurewebsites.net/'
    listener: 'http://localhost:3000'
  }

}
