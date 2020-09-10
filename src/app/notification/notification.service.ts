import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import * as _ from "lodash";
import { Router } from '@angular/router';
import { SystemParamService } from '../../environments/system-param.service';
import { BackEndService } from '../common/back-end.service';
import { constants } from '../app.constants';
import { LocalStorageService } from '../common/local-storage.service';
import { allPath } from '../allPath';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  pathList = allPath;
  appConstant = constants;
  private url = this.systemParam.SERVER.listener;
  private socket;
  omnimd = constants;
  reconnectionOnNodeDisconnect;
  throttleVar;
  isSocketConnected = false;
  userId;
  clearTimeOut;

  constructor(
    private localStorageService: LocalStorageService,
    private systemParam: SystemParamService,
    private backEndService: BackEndService
  ) {

    try {
      // if (environment.enableNotification) {
      if (true) {
        // this.socket = io(this.url, { 'reconnection': true, 'reconnectionDelay': 10000, });
      }

      this.socket.io.on('connect_error', function (data) {
        console.log('connection_error');
      });

      this.socket.on('connect', () => {
        console.log('connectAmit');
        this.isSocketConnected = true;
        this.addListener();
      });

      this.socket.on('notification-success', (notificationObject: any) => {
        // alert(JSON.stringify(notificationObject))
      });

      this.socket.on('disconnect', (reason) => {
        console.log('user disconnected');
        this.isSocketConnected = false;
        this.throttleVar = _.throttle(() => {
          if (!this.isSocketConnected) {
            const callBack = (result) => {
              if (!result) {
                this.addListener();
              }
            }
            this.socket.io.open(callBack);
            this.throttleVar();
          }
        }, 1000)
        this.throttleVar();
      });

      this.socket.on('show-notifications', (notificationObject: any) => {
        console.log(notificationObject)
      });
    } catch (e) {
      console.log('Can\'t connect');
    }
  }

  sendNotification(notificationObject) {
    try {
      this.socket.emit('send-notification', notificationObject);
    } catch (e) {
      console.log('Not able to send message', e);
    }
  }


  addListener() {
    try {
      this.userId = this.localStorageService.getValue(this.appConstant.user).userId;
      this.socket.emit('connected', this.userId);
    } catch (e) {
      console.log('Can\'t connect');
    }
  }

  notificationSave(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.notificationRest.save, false, successCallBack);
  }
  notificationGetCount(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.notificationRest.getCount, false, successCallBack);
  }

  getNotificationData(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.notificationRest.getData, false, successCallBack);
  }

  saveMarkAsRead(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.notificationRest.saveMarkAsRead, false, successCallBack);
  }

}


