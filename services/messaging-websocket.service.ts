import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { MessagingSystemService } from "./messaging-system.service";
import { HttpXsrfTokenExtractor } from "@angular/common/http";
import * as UIkit from 'uikit';

declare var SockJS;
declare var Stomp;

const URL = environment.WS_ENDPOINT;

@Injectable()
export class MessagingWebsocketService {
  private xsrf = inject(HttpXsrfTokenExtractor);
  private messagingService = inject(MessagingSystemService);

  stompClientUnread: Promise<typeof Stomp> = null;
  stompClientNotification: Promise<typeof Stomp> = null;

  count = 0;
  topic: string;

  private getHeader(): Record<string, string> | {} {
    const t = this.xsrf.getToken();
    return t ? {'X-XSRF-TOKEN': t} : {};
  }

  initializeWebSocketConnectionUnread(topic: string) {
    const ws = new SockJS(URL);
    const that = this;
    this.topic = topic;

    this.stompClientUnread = new Promise((resolve, reject) => {
      let stomp = Stomp.over(ws);

      stomp.debug = null; // removes debug logs
      stomp.connect(this.getHeader(), function (frame) {
        that.count = 0;
        stomp.subscribe(`${topic}`, (message) => {
          if (message.body) {
            that.messagingService.unreadMessages.next(JSON.parse(message.body))
            // that.msg.next(JSON.parse(message.body));
          }
        });
        resolve(stomp);
      }, function (error) {
        let timeout = 1000;
        // Retry every second for ~2 minutes before backing off to a 10s cadence.
        that.count > 120 ? timeout = 10000 : that.count++;
        setTimeout(() => {
          // stomp.close();
          that.initializeWebSocketConnectionUnread(that.topic);
        }, timeout);
        console.log('[inbox-unread] STOMP: Reconnecting...' + that.count);
      });
    });

    this.stompClientUnread.then(client => client.ws.onclose = (event) => {
      // this.msg.next(null);
      let timeout = 1000;
      // Retry every second for ~2 minutes before backing off to a 10s cadence.
      that.count > 120 ? timeout = 10000 : that.count++;
      setTimeout(() => {
        that.initializeWebSocketConnectionUnread(topic);
      }, timeout);
      console.log('[inbox-unread] STOMP: Reconnecting...' + that.count);
    });
  };

  initializeWebSocketConnectionNotification(topic: string) {
    const ws = new SockJS(URL);
    const that = this;

    this.stompClientNotification = new Promise((resolve, reject) => {
      let stomp = Stomp.over(ws);

      stomp.debug = null; // removes debug logs
      stomp.connect(this.getHeader(), function (frame) {
        that.count = 0;
        stomp.subscribe(`${topic}`, (message) => {
          if (message.body) {
            that.messagingService.threadHasChanges(JSON.parse(message.body));
            UIkit.notification({
              message: 'You have a new message <span uk-icon=\'icon: mail\'></span>',
              // status: 'primary',
              pos: 'top-center',
              timeout: 5000
            });
          }
        });
        resolve(stomp);
      }, function (error) {
        let timeout = 1000;
        // Retry every second for ~2 minutes before backing off to a 10s cadence.
        that.count > 120 ? timeout = 10000 : that.count++;
        setTimeout(() => {
          // stomp.close();
          that.initializeWebSocketConnectionNotification(topic);
        }, timeout);
        console.log('[inbox-notification] STOMP: Reconnecting...' + that.count);
      });
    });

    this.stompClientNotification.then(client => client.ws.onclose = (event) => {
      // this.msg.next(null);
      let timeout = 1000;
      // Retry every second for ~2 minutes before backing off to a 10s cadence.
      that.count > 120 ? timeout = 10000 : that.count++;
      setTimeout(() => {
        that.initializeWebSocketConnectionNotification(topic);
      }, timeout);
      console.log('[inbox-notification] STOMP: Reconnecting...' + that.count);
    });
  };

  WsJoin(path: string, action: string) {
    this.stompClientUnread.then(client => client.send(`${path}`, {}, action));
  }

}
