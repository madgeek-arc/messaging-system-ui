import {Component, OnInit} from "@angular/core";
import {MessagingSystemService} from "../services/messaging-system.service";
import {TopicThread} from "../../domain/messaging";

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.component.html',
  providers: [MessagingSystemService]
})

export class MessagesComponent implements OnInit {

  topics: TopicThread[] = null;
  selectedTopics: TopicThread[] = []

  constructor(private messagingService: MessagingSystemService) {
  }

  ngOnInit() {
   this.getTopics();
  }

  getTopics() {
    this.messagingService.getThreads().subscribe(
      res => {this.topics = res},
      error => {console.error(error)}
    );
  }

  toggleCheck(event, topic: TopicThread) {
    console.log(event.target.checked);
    if (event.target.checked) {
      this.selectedTopics.push(topic);
    }
  }

  topicIsSelected(topic) {
    return this.selectedTopics.findIndex((x) => x === topic);
  }
}
