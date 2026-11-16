import {Component, OnInit, signal, ChangeDetectionStrategy, inject, input} from "@angular/core";
import {Correspondent, TopicThread} from "../../domain/messaging";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, FormsModule } from "@angular/forms";
import {UserInfo} from "../../../../survey-tool/app/domain/userInfo";
import {MessagingSystemService} from "../../../services/messaging-system.service";
import * as UIkit from 'uikit';
import { NgSelectComponent, NgTagTemplateDirective } from "@ng-select/ng-select";
import { RichTextEditorComponent } from "../../../../survey-tool/catalogue-ui/shared/reusable-components/rich-text-editor/rich-text-editor.component";

@Component({
    selector: 'app-email-compose',
    templateUrl: 'email-compose.component.html',
    styleUrls: ['email-compose.component.scss'],
    // UIkit fires `hidden` on the modal element when the dialog closes
    host: {'(hidden)': 'noRecipients.set(false)'},
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgSelectComponent, ReactiveFormsModule, FormsModule, NgTagTemplateDirective, RichTextEditorComponent]
})

export class EmailComposeComponent implements OnInit {

  private fb = inject(UntypedFormBuilder);
  private messagingService = inject(MessagingSystemService);

  groupId = input<string>(null);

  userInfo: UserInfo = null;
  // thread: TopicThread = new TopicThread();
  newThread: UntypedFormGroup = TopicThread.toFormGroup(this.fb);
  recipients = signal<{id: string, name: string, type: string}[]>(null);
  createSuccess = signal(true);
  noRecipients = signal(false);

  flatGroups = signal<{id: string, name: string, type: string}[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.newThread = TopicThread.toFormGroup(this.fb);

    this.messagingService.getGroupList().subscribe(
      res=> {
        const flatGroups: {id: string, name: string, type: string}[] = [];
        for (let key in res) {
          for (let subKey in res[key]) {
            flatGroups.push({name: res[key][subKey].name, id: res[key][subKey].id, type: 'groupId'});
          }
        }
        this.flatGroups.set(flatGroups);
      }
    );
  }

  createTread() {
    const recipients = this.recipients();
    if (!recipients?.length) {
      this.noRecipients.set(true);
      return;
    }
    this.noRecipients.set(false);

    this.newThread.get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('from').get('email').setValue(this.userInfo.user.email);
    if (this.groupId()) {
      this.newThread.get('from').get('groupId').setValue(this.groupId());
      this.newThread.get('messages').get('0').get('from').get('groupId').setValue(this.groupId());
    }
    this.newThread.get('messages').get('0').get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newThread.get('messages').get('0').get('from').get('email').setValue(this.userInfo.user.email);

    while ((this.newThread.get('to') as UntypedFormArray).length < recipients.length) {
      (this.newThread.get('to') as UntypedFormArray).push(this.fb.group(new Correspondent()));
      (this.newThread.get('messages').get('0').get('to') as UntypedFormArray).push(this.fb.group(new Correspondent()));
    }
    for (let i = 0; i < recipients.length; i++) {
      if (recipients[i].type !== 'email') {
        this.newThread.get('to').get(''+i).get('groupId').setValue(recipients[i].id);
        this.newThread.get('messages').get('0').get('to').get(''+i).get('groupId').setValue(recipients[i].id);
      }
      else {
        this.newThread.get('to').get(''+i).get('email').setValue(recipients[i].id);
        this.newThread.get('messages').get('0').get('to').get(''+i).get('email').setValue(recipients[i].id);
      }
    }

    this.messagingService.postThread(this.newThread.value).subscribe(
      res=> {
        this.createSuccess.set(true);
        UIkit.modal('#emailCompose').hide();
        this.newThread.reset();
      },
      error => {
        this.createSuccess.set(false);
        this.closeAlert();
        console.error(error);
      }
    );
  }

  messageBody() {
    return this.newThread.get('messages').get('0') as UntypedFormGroup;
  }

  closeAlert() {
    setTimeout(() => {
      UIkit.alert('#errorAlert').close();
    }, 5000);
    setTimeout(() => {
      this.createSuccess.set(true);
    }, 4550);
  }

  addTagPromise(name) {
    return new Promise((resolve) => {
      this.loading.set(true);
      // Simulate backend call.
      setTimeout(() => {
        resolve({ id: name, name: name, type: 'email', valid: true });
        this.loading.set(false);
      }, 500);
    })
  }

}
