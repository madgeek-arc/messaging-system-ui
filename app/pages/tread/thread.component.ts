import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MessagingSystemService} from "../../services/messaging-system.service";
import {Correspondent, Message, TopicThread} from "../../domain/messaging";
import {ViewportScroller} from "@angular/common";
import {UserInfo} from "../../../../survey-tool/app/domain/userInfo";
import {FormBuilder, FormGroup} from "@angular/forms";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-thread',
  templateUrl: 'thread.component.html',
  styleUrls: ['thread.component.scss']
})

export class ThreadComponent implements OnInit {

  threadId: string = null;
  thread: TopicThread = null;
  message: Message = null;
  subject: string = null;
  userInfo: UserInfo = null;
  newMessage: FormGroup = this.fb.group(new Message());
  showReply: boolean = false;

  public editor = ClassicEditor;

  constructor(private route: ActivatedRoute, private router: Router, private messagingService: MessagingSystemService,
              private viewportScroller: ViewportScroller, private fb: FormBuilder) {

    this.newMessage.setControl('to', this.fb.group(new Correspondent()));
    this.newMessage.setControl('from', this.fb.group(new Correspondent()));
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.threadId = params['threadId'];
        this.messagingService.getThread(this.threadId).subscribe(
          res => {
            this.thread = res
            this.thread.messages.forEach(message => {
              this.messagingService.setMessageReadParam(this.threadId, message.id, true).subscribe();
            });
          },
          error => {console.error(error)},
          ()=> {
            this.route.fragment.subscribe(fragment => {
              setTimeout( timeout => {this.viewportScroller.scrollToAnchor(fragment);}, 0)
            });
          }
        );
      }
    );

    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.newMessage.get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newMessage.get('from').get('email').setValue(this.userInfo.user.email);

  }

  firstLetters(name: string) {
    return name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
  }

  reply(message: Message) {
    this.message = message;
    this.newMessage.get('to').patchValue(this.message.from);
    this.subject = this.thread.subject;
    this.showReply = true;
    setTimeout( timeout => {this.viewportScroller.scrollToAnchor('response')}, 0);
  }

}
