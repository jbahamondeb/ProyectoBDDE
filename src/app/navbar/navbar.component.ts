import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title: string;

  constructor(private matIconRegistry: MatIconRegistry,private domSanitizer: DomSanitizer) { 
    this.title = "#SalDeTuBurbuja"
    this.matIconRegistry.addSvgIcon(
      "udec",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/udec.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "fiudec",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/fiudec.svg")
    );

  }

  ngOnInit(): void {
  }

}
