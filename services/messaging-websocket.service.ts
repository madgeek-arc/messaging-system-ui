import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {MessagingSystemService} from "./messaging-system.service";
import * as UIkit from 'uikit';
import {HttpClient} from "@angular/common/http";
import {XsrfTokenExtractor} from "../../survey-tool/catalogue-ui/services/xsrf-token-extractor.service";

declare var SockJS;
declare var Stomp;

const URL = environment.WS_ENDPOINT;

@Injectable()
export class MessagingWebsocketService {

  stompClientUnread: Promise<typeof Stomp> = null;
  stompClientNotification: Promise<typeof Stomp> = null;

  count = 0;
  topic

  constructor(private messagingService: MessagingSystemService, public http: HttpClient, private xsrf: XsrfTokenExtractor) {
  }

  initializeWebSocketConnectionUnread(topic: string) {
    const ws = new SockJS(URL);
    const that = this;
    this.topic = topic;

    this.stompClientUnread = new Promise((resolve, reject) => {
      let stomp = Stomp.over(ws);

      stomp.debug = null; // removes debug logs
      stomp.connect(this.xsrf.getHeader(), function (frame) {
        const timer = setInterval(() => {
          if (stomp.connected) {
            clearInterval(timer);
            that.count = 0;
            stomp.subscribe(`${topic}`, (message) => {
              if (message.body) {
                that.messagingService.unreadMessages.next(JSON.parse(message.body))
                // that.msg.next(JSON.parse(message.body));
              }
            });
            resolve(stomp);
          }
        }, 1000);
      }, function (error) {
        let timeout = 1000;
        that.count > 20 ? timeout = 10000 : that.count++ ;
        setTimeout( () => {
          // stomp.close();
          that.initializeWebSocketConnectionUnread(that.topic);
        }, timeout);
        console.log('STOMP: Reconnecting...');
      });
    });

    this.stompClientUnread.then(client => client.ws.onclose = (event) => {
      // this.msg.next(null);
      this.initializeWebSocketConnectionUnread(topic);
    });
  };

  initializeWebSocketConnectionNotification(topic: string) {
    const ws = new SockJS(URL);
    const that = this;

    this.stompClientNotification = new Promise((resolve, reject) => {
      let stomp = Stomp.over(ws);

      stomp.debug = null; // removes debug logs
      stomp.connect(this.xsrf.getHeader(), function (frame) {
        const timer = setInterval(() => {
          if (stomp.connected) {
            clearInterval(timer);
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
          }
        }, 500);
      }, function (error) {
        let timeout = 1000;
        that.count > 20 ? timeout = 10000 : that.count++ ;
        setTimeout( () => {
          // stomp.close();
          that.initializeWebSocketConnectionNotification(that.topic);
        }, timeout);
        console.log('STOMP: Reconnecting...');
      });
    });

    this.stompClientNotification.then(client => client.ws.onclose = (event) => {
      // this.msg.next(null);
      this.initializeWebSocketConnectionNotification(topic);
    });
  };

  WsJoin(path: string, action: string) {
    this.stompClientUnread.then(client => client.send(`${path}`, {}, action));
  }

}
