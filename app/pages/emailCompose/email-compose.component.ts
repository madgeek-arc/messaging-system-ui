import {Component, OnInit} from "@angular/core";
import {Correspondent, TopicThread} from "../../domain/messaging";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
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
  recipients: {id: string, name: string, type: string}[] = null;
  createSuccess: boolean = null

  flatGroups: {id: string, name: string, type: string}[] = []
  loading = false;

  public editor = ClassicEditor;

  constructor(private fb: FormBuilder, private messagingService: MessagingSystemService) {}

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    this.messagingService.getGroupList().subscribe(
      res=> {
        for (let key in res) {
          for (let subKey in res[key]) {
            this.flatGroups.push({name: res[key][subKey].name, id: res[key][subKey].id, type: 'groupId'});
          }
        }
      }
    );

    this.newThread.get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('from').get('email').setValue(this.userInfo.user.email);
    this.newThread.get('messages').get('0').get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('messages').get('0').get('from').get('email').setValue(this.userInfo.user.email);
  }

  createTread() {
    while ((this.newThread.get('to') as FormArray).length < this.recipients.length) {
      (this.newThread.get('to') as FormArray).push(this.fb.group(new Correspondent()));
      (this.newThread.get('messages').get('0').get('to') as FormArray).push(this.fb.group(new Correspondent()));
    }
    for (let i = 0; i < this.recipients.length; i++) {
      if (this.recipients[i].type !== 'email') {
        this.newThread.get('to').get(''+i).get('groupId').setValue(this.recipients[i].id);
        this.newThread.get('messages').get('0').get('to').get(''+i).get('groupId').setValue(this.recipients[i].id);
      }
      else {
        this.newThread.get('to').get(''+i).get('email').setValue(this.recipients[i].id);
        this.newThread.get('messages').get('0').get('to').get(''+i).get('email').setValue(this.recipients[i].id);
      }
    }

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

  addTagPromise(name) {
    return new Promise((resolve) => {
      this.loading = true;
      // Simulate backend call.
      setTimeout(() => {
        resolve({ id: name, name: name, type: 'email', valid: true });
        this.loading = false;
      }, 1000);
    })
  }

}
