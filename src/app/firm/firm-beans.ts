export class FirmSignUp {
    firstName: string;
    lastName: string;
    password: string;
    businessName: string;
    workEmail: string;
    businessCategory = 'select';
    roleId = 2;
}

export class FirmProfile {
    firmProfileId = 41;
    businessName: string; //
    branchName: string;// 
    streetAddress: string;//
    city;
    cityId;//
    cityName;
    // province = new Province();
    provinceId;//
    zipCode;//
    businessDesc: string;//
    isAccountingFirm: boolean;
    isRegisteredFirm: boolean;
    hstNumber: string;//
    webSite: string;
    billEmailAddress: string;//
    isBothAddressSame: boolean;
    billStreetAddress: string;//

    billCity;
    billCityId;//
    billCityName;

    // billProvince = new Province();
    billProvinceId;//
    billZipcode: string;//
    firstName: string;
    lastName: string;
    phoneNumber: string;
    workEmail: string;
    userId = 2
}

export class City {
    cityId;
    cityName;
}

export class Province {
    provinceId;
    provinceName;
}

// export class FirmSignUp {
//     firstName = 's';
//     lastName = 's';
//     password = 'AA';
//     businessName = 's';
//     workEmail = 'AA';
//     businessCategory = 's';
// }

// "@angular/animations": "~8.2.0",
    // "@angular/common": "~8.2.0",
    // "@angular/compiler": "~8.2.0",
    // "@angular/core": "~8.2.0",
    // "@angular/forms": "~8.2.0",
    // "@angular/platform-browser": "~8.2.0",
    // "@angular/platform-browser-dynamic": "~8.2.0",
    // "@angular/router": "~8.2.0",
    // "@ng-bootstrap/ng-bootstrap": "^5.3.1",
    // "angular-loading-bar": "^0.9.0",
    // "bootstrap": "4.1.1",
    // "jquery": "^3.5.1",
    // "moment": "^2.22.2",
    // "moment-timezone": "^0.5.26",
    // "ngx-spinner": "^9.0.2",
    // "primeng": "^6.1.6",
    // "rxjs": "~6.4.0",
    // "tslib": "^1.10.0",
    // "zone.js": "~0.9.1"

    // "@angular-devkit/build-angular": "~0.802.1",
    // "@angular/cli": "~8.2.1",
    // "@angular/compiler-cli": "~8.2.0",
    // "@angular/language-service": "~8.2.0",
    // "@types/node": "~8.9.4",
    // "@types/jasmine": "~3.3.8",
    // "@types/jasminewd2": "~2.0.3",
    // "codelyzer": "^5.0.0",
    // "jasmine-core": "~3.4.0",
    // "jasmine-spec-reporter": "~4.2.1",
    // "karma": "~4.1.0",
    // "karma-chrome-launcher": "~2.2.0",
    // "karma-coverage-istanbul-reporter": "~2.0.1",
    // "karma-jasmine": "~2.0.1",
    // "karma-jasmine-html-reporter": "^1.4.0",
    // "protractor": "~5.4.0",
    // "ts-node": "~7.0.0",
    // "tslint": "~5.15.0",
    // "typescript": "~3.5.3"