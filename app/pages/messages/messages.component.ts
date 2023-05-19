import {Component, OnInit} from "@angular/core";
import {MessagingSystemService} from "../../../services/messaging-system.service";
import {TopicThread} from "../../domain/messaging";
import {UserInfo} from "../../../../survey-tool/app/domain/userInfo";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.component.html',
  styleUrls: ['messages.component.scss']
})

export class MessagesComponent implements OnInit {

  inbox: TopicThread[] = null;
  sent: TopicThread[] = null;
  groupId: string = null;
  user: UserInfo = null;
  selectedTopics: TopicThread[] = [];

  constructor(private route: ActivatedRoute, private messagingService: MessagingSystemService) {
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userInfo'));
    this.route.params.subscribe(params=> this.groupId = params['id']);

    this.refreshInbox();
  }

  refreshInbox() {
    this.messagingService.getInbox(this.groupId).subscribe(
      res => {
        this.inbox = res;
        this.sent = [];
      },
      error => {console.error(error)}
    );
  }

  refreshOutbox() {
    this.messagingService.getOutbox(this.groupId, this.user.user.email).subscribe(
      res => {
        this.sent = res;
        this.inbox = [];
      },
      error => {console.error(error)}
    );
  }

  markAsReadUnread(thread: TopicThread, read: boolean) {
    thread.messages.forEach(message => {
      this.messagingService.setMessageReadParam(thread.id, message.id, read).subscribe(
        res=> {
          thread.unread = res.unread;
        }
      );
    });

  }

  batchAction(read: boolean) {
    console.log(this.selectedTopics);
    this.selectedTopics.forEach(thread => {
      this.markAsReadUnread(thread, read);
    });
  }

  toggleCheck(event, topic: TopicThread) {
    if (event.target.checked) {
      this.selectedTopics.push(topic);
    } else {
      const index = this.selectedTopics.indexOf(topic);
      if (index > -1)
        this.selectedTopics.splice(index, 1);
    }
  }

  toggle(source) {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] !== source.target.checked)
        checkboxes[i]['checked'] = source.target.checked;
    }
    if (source.target.checked) {
      if (this.inbox.length > 0) {
        this.selectedTopics = [...this.inbox];
      } else {
        this.selectedTopics = [...this.sent];
      }
    } else
      this.selectedTopics = [];
  }
}
