import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-email-compose',
  templateUrl: 'email-compose.component.html'
})

export class EmailComposeComponent implements OnInit {

  @Input() message: string = null;

  ngOnInit() {
  }
}
