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
  selectedTopics: TopicThread[] = []

  constructor(private route: ActivatedRoute, private messagingService: MessagingSystemService) {
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userInfo'));
    this.route.params.subscribe(params=> this.groupId = params['id']);

    this.refreshInbox();
    // this.refreshOutbox();
  }

  refreshInbox() {
    this.messagingService.getInbox(this.groupId).subscribe(
      res => {this.inbox = res},
      error => {console.error(error)}
    );
  }

  refreshOutbox() {
    this.messagingService.getOutbox(this.groupId, this.user.user.email).subscribe(
      res => {this.sent = res},
      error => {console.error(error)}
    );
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

  topicIsSelected(topic) {
    return this.selectedTopics.findIndex((x) => x === topic);
  }

}
