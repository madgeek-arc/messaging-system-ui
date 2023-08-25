import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {UnreadMessages} from "../app/domain/messaging";

declare var SockJS;
declare var Stomp;

const URL = environment.WS_ENDPOINT;

@Injectable()
export class MessagingWebsocketService {

  stompClient: Promise<typeof Stomp>;
  msg: BehaviorSubject<UnreadMessages> = new BehaviorSubject<UnreadMessages>(null);

  constructor() {}

  initializeWebSocketConnection(topic: string) {
    const ws = new SockJS(URL);
    const that = this;

    this.stompClient = new Promise((resolve, reject) => {
      let stomp = Stomp.over(ws);

      stomp.connect({}, function(frame) {
        const timer = setInterval(() => {
          if (stomp.connected) {
            clearInterval(timer);
            stomp.subscribe(`${topic}`, (message) => {
              if (message.body) {
                that.msg.next(JSON.parse(message.body));
              }
            });
            // that.WsJoin(id, resourceType, action);
            resolve(stomp);
          }
        }, 500);
      }, function (error) {
        setTimeout( () => {that.initializeWebSocketConnection(topic)}, 1000);
        console.log('STOMP: Reconnecting...');
      });
    });

    this.stompClient.then(client => client.ws.onclose = (event) => {
      this.msg.next(null);
      this.initializeWebSocketConnection(topic);
    });
  };


  WsJoin(path: string, action: string) {
    this.stompClient.then( client => client.send(`${path}`, {}, action));
  }
}
