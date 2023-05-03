import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MessagingSystemService} from "../../services/messaging-system.service";
import {TopicThread} from "../../domain/messaging";

@Component({
  selector: 'app-thread',
  templateUrl: 'thread.component.html',
  styleUrls: ['thread.component.scss']
})

export class ThreadComponent implements OnInit {

  threadId: string = null;
  thread: TopicThread = null;

  constructor(private route: ActivatedRoute, private messagingService: MessagingSystemService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.threadId = params['threadId'];
        this.messagingService.getThread(this.threadId).subscribe(
          res => { this.thread = res},
          error => {console.error(error)}
        );
      }
    );
  }

  firstLetters(name: string) {
  return name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
  }

}
