import {Component, OnInit} from "@angular/core";
import {TopicThread} from "../../domain/messaging";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserInfo} from "../../../../survey-tool/app/domain/userInfo";
import {MessagingSystemService} from "../../../services/messaging-system.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UIkit from "uikit";

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
  createSuccess: boolean = null

  public editor = ClassicEditor;

  constructor(private fb: FormBuilder, private messagingService: MessagingSystemService) {}

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    this.newThread.get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('from').get('email').setValue(this.userInfo.user.email);
    this.newThread.get('messages').get('0').get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('messages').get('0').get('from').get('email').setValue(this.userInfo.user.email);
  }

  createTread() {
    this.newThread.get('to').get('0').get('email').setValue(this.recipients);
    this.newThread.get('messages').get('0').get('to').get('0').get('email').setValue(this.recipients);
    this.messagingService.postThread(this.newThread.value).subscribe(
      res=> {
        this.createSuccess = true;
        UIkit.modal('#emailCompose').hide();
        // this.timer(0.1);
      },
      error => {
        this.createSuccess = false;
        console.error(error);
      }
    );
  }

  messageBody() {
    return this.newThread.get('messages').get('0') as FormGroup;
  }

}
