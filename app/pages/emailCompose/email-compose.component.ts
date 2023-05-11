import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Correspondent, Message} from "../../domain/messaging";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserInfo} from "../../../../survey-tool/app/domain/userInfo";

@Component({
  selector: 'app-email-compose',
  templateUrl: 'email-compose.component.html',
  styleUrls: ['email-compose.component.scss']
})

export class EmailComposeComponent implements OnInit, OnChanges {

  @Input() message: Message = null;
  @Input() subject: string = null;

  userInfo: UserInfo = null;
  newMessage: FormGroup = this.fb.group(new Message());

  public editor = ClassicEditor;

  constructor(private fb: FormBuilder) {
    this.newMessage.setControl('to', this.fb.group(new Correspondent()));
    this.newMessage.setControl('from', this.fb.group(new Correspondent()));
  }

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.newMessage.get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newMessage.get('from').get('email').setValue(this.userInfo.user.email);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message'].currentValue) {
      this.newMessage.get('to').patchValue(this.message.from);
    }
  }

}
