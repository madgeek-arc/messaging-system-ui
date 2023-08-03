import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MessagingSystemService} from "../../../services/messaging-system.service";
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

  @ViewChild('threadHeader') targetElement: any;

  threadId: string = null;
  groupId: string = null;
  thread: TopicThread = null;
  message: Message = null;
  subject: string = null;
  userInfo: UserInfo = null;
  newMessage: FormGroup = this.fb.group(new Message());
  anonymous: boolean = true;
  showReply: boolean = false;
  fragment: string = null

  public editor = ClassicEditor;

  constructor(private route: ActivatedRoute, private router: Router, private messagingService: MessagingSystemService,
              private viewportScroller: ViewportScroller, private fb: FormBuilder) {

    this.newMessage.setControl('to', this.fb.array([new Correspondent()]));
    this.newMessage.setControl('from', this.fb.group(new Correspondent()));

    if (this.router.getCurrentNavigation()?.extras?.state?.['returnTo'])
      this.fragment = this.router.getCurrentNavigation()?.extras.state['returnTo'];
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.threadId = params['threadId'];
        this.groupId = params['id'];
        this.messagingService.getThread(this.threadId).subscribe(
          res => {
            this.thread = res
            this.thread.messages.forEach(message => {
              this.messagingService.setMessageReadParam(this.threadId, message.id, true).subscribe();
            });
          },
          error => {console.error(error)},
          ()=> {

            // console.log(this.router.getCurrentNavigation().extras.state.returnTo);
            this.route.fragment.subscribe(fragment => {

              setTimeout( timeout => {

                const threadHeaderHeight = this.targetElement.nativeElement.offsetHeight;

                let x = getComputedStyle(document.documentElement) .getPropertyValue('--header-height')
                // console.log(x);
                x = x.split('px')[0];
                let y: number = +x;
                //adding uk-padding and uk-margin-bottom heights
                y = y + threadHeaderHeight + 20 + 40;
                this.viewportScroller.setOffset([0,y]);

                this.viewportScroller.scrollToAnchor(fragment);
                }, 0)
            });
          }
        );
      }
    );

  }

  firstLetters(name: string) {
    return name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
  }

  reply(message: Message) {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.newMessage.get('from').get('name').setValue(this.userInfo.user.fullname);
    this.newMessage.get('from').get('email').setValue(this.userInfo.user.email);
    this.newMessage.get('from').get('groupId').setValue(this.groupId);
    this.newMessage.get('replyToMessageId').setValue(message.id);
    this.message = message;
    this.newMessage.controls['to'].get('0').patchValue(this.message.from);
    this.subject = this.thread.subject;
    this.showReply = true;
    setTimeout( timeout => {this.viewportScroller.scrollToAnchor('response')}, 0);
  }

  sendMessage() {
    this.messagingService.postMessage(this.threadId, this.newMessage.value, this.anonymous).subscribe(
      res=> {
        this.thread = res;
        this.showReply = false;
        this.newMessage.reset();
      },
      error => {console.error(error)}
    );
  }

}
