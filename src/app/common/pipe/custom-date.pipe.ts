import { LOCALE_ID, Pipe, PipeTransform, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { constants } from '../../app.constants';
import * as moment from 'moment';
import * as moment_timezone from "moment-timezone";
 
@Pipe({
  name: 'customDate'
})

export class CustomDate implements PipeTransform {
  datePipe: DatePipe;
  appConstant = constants;
  dateFormat = 'MM/dd/yyyy hh:mm a';
  timeZone = '+05:30';
  timeFormat = 'hh:mm A';

  constructor(
    @Inject(LOCALE_ID) private locale: string) {
    this.datePipe = new DatePipe(locale);
  }

  transform(value: any, args?: any, dateOnly?): any {
    if (value !== null && value !== '' && value !== undefined) {
      if (args === 'toUTC') {
        if (dateOnly) {
          // const date = new Date(value.replace(/-/g, '/')).toUTCString();
          return this.datePipe.transform(new Date(value.replace(/-/g, '/')).toUTCString(), this.appConstant.templateDateFormat);
        } else {
          return new Date(value.replace(/-/g, '/')).toUTCString();
        }
      } else if (args === 'fromUTC' && value) {
        return this.datePipe.transform(new Date(value), dateOnly ? this.appConstant.dateValueFormat : this.dateFormat);
      } else if (args === 'fromUTCTime') {
        const date = this.datePipe.transform(new Date(value), this.dateFormat);
        return date.substring(11, 20);
      } else if (args === 'fromUTCDateTime' && value) {
        // const date = this.datePipe.transform(new Date(value), this.appConstant.dateTimeFormate);
        return moment.utc(value).format('MMMM DD, YYYY h:mm A'); // for momentt
        // return date;
      } else if (args === 'dateOnly') {
        // return moment.utc(value).format(this.appConstant.dateValueFormat);
        return moment(value).format(this.appConstant.dateValueFormat);
      } else if (args === 'schedularDate') {
        return this.datePipe.transform(new Date(value), dateOnly ? this.appConstant.schedularFormat : this.dateFormat);
      } else if (args === 'schedularDateTime') {
        return this.datePipe.transform(new Date(value), dateOnly ? this.appConstant.dateSchedularFormat : this.dateFormat);
      } else if (args === 'UTCTime') {
        return this.datePipe.transform(new Date(value), dateOnly ? this.appConstant.dateValueFormat : this.timeFormat);
      } else if (args === 'monthYearOnly') {
        return this.datePipe.transform(new Date(value), this.appConstant.templateMonthFormat);
      } else if (args === 'timeOnly') {
        return moment.utc(value).format(this.timeFormat);
      } else if (args === 'dateTime') {
        return moment.utc(value).format('MM/DD/YYYY hh:mm A');
      } else if (args === 'NiceDateFormatDateOnly') {
        return this.niceDateFormat(value);
      } else if (args === 'NiceDateFormatDateAndMonthOnly') {
        return this.niceDateAndMonthFormat(value);
      }
    }
  }

  niceDateFormat(value: string) {
    var _value = Number(value);

    var dif = Math.floor(((Date.now() - _value) / 1000) / 86400);

    if (dif < 30) {
      return this.convertToNiceDate(value);
    } else {
      var datePipe = new DatePipe("en-US");
      value = datePipe.transform(value, 'MMM-dd-yyyy');
      return value;
    }
  }

  niceDateAndMonthFormat(value: string) {
    var _value = Number(value);

    var dif = Math.floor(((Date.now() - _value) / 1000) / 86400);

    if (dif < 3650) {
      return this.convertToNiceDateAndMonth(value);
    } else {
      var datePipe = new DatePipe("en-US");
      value = datePipe.transform(value, 'MMM-dd-yyyy');
      return value;
    }
  }

  convertToNiceDate(time: string) {
    var date = new Date(time),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      daydiff = Math.floor(diff / 86400);

    if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31)
      return '';

    return daydiff == 0 && (
      diff < 60 && "Just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
      daydiff == 1 && "Yesterday" ||
      daydiff < 7 && daydiff + " days ago" ||
      daydiff < 31 && Math.ceil(daydiff / 7) + " week(s) ago";
  }

  convertToNiceDateAndMonth(time: string) {
    var date = new Date(time);
    const jan2 = moment.utc(time);

    var utcFormat = moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
    var date1 = new Date(utcFormat);

    var diff = (((moment().toDate()).getTime() - date1.getTime()) / 1000),
      
    daydiff = Math.floor(diff / 86400);

    if (isNaN(daydiff) || daydiff < 0 || daydiff >= 3651)
      return '';

    return daydiff == 0 && (
      diff < 60 && "Just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
      daydiff == 1 && "Yesterday" ||
      daydiff < 7 && daydiff + " days ago" ||
      daydiff < 31 && Math.ceil(daydiff / 7) + " week(s) ago" ||
      daydiff < 365 && Math.floor(daydiff / 30) + " month(s) ago" ||
      daydiff < 3651 && Math.floor(daydiff / 365) + " year(s) ago";
  }

  getDateWithAddedDays(num) {
    const someDate = new Date();
    someDate.setDate(someDate.getDate() + num);
    someDate.setHours(0, 0, 0, 0);
    return moment(someDate, this.appConstant.dateValueFormat).utcOffset(0, true).toDate().getTime()
  }

  getCurrentTimeZone() {
    return moment_timezone.tz(new Date().getMilliseconds(), moment_timezone.tz.guess()).format('z');
  }
}

