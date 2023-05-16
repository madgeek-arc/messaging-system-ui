import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Correspondent, Message, TopicThread} from "../../domain/messaging";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserInfo} from "../../../../survey-tool/app/domain/userInfo";

@Component({
  selector: 'app-email-compose',
  templateUrl: 'email-compose.component.html',
  styleUrls: ['email-compose.component.scss']
})

export class EmailComposeComponent implements OnInit {

  userInfo: UserInfo = null;
  thread: TopicThread = new TopicThread();
  newThread: FormGroup = TopicThread.toFormGroup(this.fb);
  recipients: string = null;

  public editor = ClassicEditor;

  constructor(public fb: FormBuilder) {
    // this.newThread.setControl('to', this.fb.array([new Correspondent()]));
    // this.newThread.setControl('from', this.fb.group(new Correspondent()));
  }

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    // for (let controlsKey in this.newThread.controls) {
    //   console.log(controlsKey);
    //   console.log(this.newThread.controls[controlsKey]);
    // }
    this.newThread.get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('from').get('email').setValue(this.userInfo.user.email);
    this.newThread.get('messages').get('0').get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('messages').get('0').get('from').get('name').setValue(this.userInfo.user.fullname);
  }


  protected readonly FormGroup = FormGroup;
}
