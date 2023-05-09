import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MessagingSystemService} from "../../services/messaging-system.service";
import {Message, TopicThread} from "../../domain/messaging";

@Component({
  selector: 'app-thread',
  templateUrl: 'thread.component.html',
  styleUrls: ['thread.component.scss']
})

export class ThreadComponent implements OnInit {

  threadId: string = null;
  thread: TopicThread = null;
  message: Message = null;

  constructor(private route: ActivatedRoute, private messagingService: MessagingSystemService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.threadId = params['threadId'];
        this.messagingService.getThread(this.threadId).subscribe(
          res => {
            this.thread = res
            this.thread.messages.forEach(message => {
              // message.read = true;
              this.messagingService.setMessageReadParam(this.threadId, message.id, true).subscribe();
            });
            this.thread.messages.reverse();
          },
          error => {console.error(error)}
        );
      }
    );
  }

  firstLetters(name: string) {
    return name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
  }

  reply(message: Message) {
    this.message = message;
  }

}
