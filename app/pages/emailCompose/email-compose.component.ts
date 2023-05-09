import {Component, Input, OnInit} from "@angular/core";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Message} from "../../domain/messaging";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-email-compose',
  templateUrl: 'email-compose.component.html',
  styleUrls: ['email-compose.component.scss']
})

export class EmailComposeComponent implements OnInit {

  @Input() message: Message = null;

  newMessage: FormGroup = this.fb.group(new Message());

  public editor = ClassicEditor;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

}
