import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hope you are having a nice day';

  constructor(private modalService: NgbModal) {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }
}
