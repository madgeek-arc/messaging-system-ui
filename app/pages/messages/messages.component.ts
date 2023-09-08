import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {MessagingSystemService} from "src/messaging-system-ui/services/messaging-system.service";
import {TopicThread} from "../../domain/messaging";
import {UserInfo} from "../../../../survey-tool/app/domain/userInfo";
import {ActivatedRoute} from "@angular/router";
import {fromEvent} from "rxjs";
import {debounceTime, delay, distinctUntilChanged, map} from "rxjs/operators";
import UIkit from "uikit";
import {URLParameter} from "../../../../survey-tool/catalogue-ui/domain/url-parameter";

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.component.html',
  styleUrls: ['messages.component.scss']
})

export class MessagesComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  inbox: TopicThread[] = null;
  sent: TopicThread[] = null;
  groupId: string = null;
  fragment: string = null;
  user: UserInfo = null;
  selectedTopics: TopicThread[] = [];
  searchTerm: string = null;
  order: string = null;
  urlParameters: URLParameter[] = [];

  //pagination
  from: number;
  to: number;
  size: number;

  constructor(private route: ActivatedRoute, private messagingService: MessagingSystemService) {
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userInfo'));
    this.route.params.subscribe(
      params=> {
        this.groupId = params['id'];
        this.route.fragment.subscribe(fragment=> {
          this.fragment = fragment;
          if (fragment === 'sent') {
            this.refreshOutbox();
            UIkit.tab('#tab').show(1);
          }
          else {
            this.refreshInbox();
            UIkit.tab('#tab').show(0);
          }
        });
      }
    );

    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => { // get value
        return event.target.value;
      })
      // , filter(res => res.length > 2) // if character length greater then 2
      , debounceTime(500) // Time in milliseconds between key events
      , distinctUntilChanged() // If previous query is different from current
    ).subscribe((text: string) => {
        if (this.inbox.length > 0) {
          this.updateUrlParams('regex', text);
          this.refreshInbox(this.urlParameters);
        }
        else if (this.sent.length > 0) {
          this.updateUrlParams('regex', text);
          this.refreshOutbox(this.urlParameters)
        }
      }
    );
  }

  refreshInbox(urlParams?: URLParameter[]) {
    this.messagingService.getInbox(this.groupId, urlParams).subscribe(
      res => {
        this.inbox = res;
        this.sent = [];
      },
      error => {console.error(error)}
    );
  }

  refreshOutbox(urlParams?: URLParameter[]) {
    this.messagingService.getOutbox(this.groupId, this.user.user.email, urlParams).subscribe(
      res => {
        this.sent = res;
        this.inbox = [];
      },
      error => {console.error(error)}
    );
  }

  markAsReadUnread(thread: TopicThread, read: boolean) {
    let count = 0;
    for (const message of thread.messages) {
      if (message.read == read)
        continue;
      count++;
      setTimeout(()=> {
        this.messagingService.setMessageReadParam(thread.id, message.id, read).subscribe(
          res => {
            thread.read = res.read;
          }
        );
      }, count * 100)

    }
    setTimeout(()=> {
      if (this.fragment === 'sent') {
        this.refreshOutbox(this.urlParameters)
      } else {
        this.refreshInbox(this.urlParameters);
      }
      console.log('Get unread messages from messages component');
      this.messagingService.setUnreadCount();
    }, count * 100)
  }

  batchAction(read: boolean) {
    // console.log(this.selectedTopics);
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

  updateUrlParams(key: string, value: string | string[]) {
    let found = false;
    for (const urlParameter of this.urlParameters) {
      if (urlParameter.key === key) {
        found = true;
        urlParameter.values = [];
        if (value instanceof Array) {
          if (value.length === 0)
            this.urlParameters.splice(this.urlParameters.indexOf(urlParameter), 1);
          else
            urlParameter.values = value;
        } else {
          if (value === '' || value === null)
            this.urlParameters.splice(this.urlParameters.indexOf(urlParameter), 1);
          else
            urlParameter.values.push(value);
        }
        break;
      }
    }
    if (!found) {
      if (value === null || value === '' || value?.length === 0) {
        return;
      }
      const newFromParameter: URLParameter = {
        key: key,
        values: value instanceof Array ? value : [value]
      };
      this.urlParameters.push(newFromParameter);
    }

  }

  changeOrder(order: string) {
    this.updateUrlParams('sortBy', 'created');
    this.updateUrlParams('direction', order);
    if (this.fragment === 'sent')
      this.refreshOutbox(this.urlParameters);
    else
      this.refreshInbox(this.urlParameters);
  }

}
