import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {MessagingSystemService} from "./messaging-system.service";
import UIkit from "uikit";

declare var SockJS;
declare var Stomp;

const URL = environment.WS_ENDPOINT;

@Injectable()
export class MessagingWebsocketService {

  stompClientUnread: Promise<typeof Stomp> = null;
  stompClientNotification: Promise<typeof Stomp> = null;

  constructor(private messagingService: MessagingSystemService) {}

  initializeWebSocketConnectionUnread(topic: string) {
    const ws = new SockJS(URL);
    const that = this;

    this.stompClientUnread = new Promise((resolve, reject) => {
      let stomp = Stomp.over(ws);

      stomp.debug = null; // removes debug logs
      stomp.connect({}, function(frame) {
        const timer = setInterval(() => {
          if (stomp.connected) {
            clearInterval(timer);
            stomp.subscribe(`${topic}`, (message) => {
              if (message.body) {
                that.messagingService.unreadMessages.next(JSON.parse(message.body))
                // that.msg.next(JSON.parse(message.body));
              }
            });
            resolve(stomp);
          }
        }, 500);
      }, function (error) {
        setTimeout( () => {that.initializeWebSocketConnectionUnread(topic)}, 2000);
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
      stomp.connect({}, function(frame) {
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
        setTimeout( () => {that.initializeWebSocketConnectionNotification(topic)}, 2000);
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
