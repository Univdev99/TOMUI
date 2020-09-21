import { Component, OnInit } from '@angular/core';
import { allPath } from '../../../allPath';
import { NavigationService } from '../../../common/navigation.service';
import { Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  pathList = allPath;
  constructor(private navigationService: NavigationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

}
