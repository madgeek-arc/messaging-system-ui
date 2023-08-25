import {Injectable, NgZone} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Message, TopicThread, UnreadMessages} from "../app/domain/messaging";
import {getCookie} from "../../survey-tool/catalogue-ui/shared/reusable-components/cookie-management";
import {URLParameter} from "../../survey-tool/catalogue-ui/domain/url-parameter";
import {BehaviorSubject} from "rxjs";

let headers= new HttpHeaders();

@Injectable({ providedIn: 'root' })
export class MessagingSystemService {

  private apiEndpoint: string = environment.MESSAGING_ENDPOINT;
  unreadMessages: BehaviorSubject<UnreadMessages> = new BehaviorSubject<UnreadMessages>(new UnreadMessages());
  eventSource : EventSource | undefined;

  constructor(private httpClient: HttpClient, private zone: NgZone) {}

  getThreads() {
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/threads');
  }

  getInbox(groupId: string, urlParams?: URLParameter[]){
    this.setAuthorizationHeaders();
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    if (urlParams){
      for (let urlParam of urlParams) {
        for (const value of urlParam.values)
          params = params.append(urlParam.key, value);
      }
    }
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/inbox/threads/search', {params: params, headers: headers});
  }

  getOutbox(groupId: string, email: string, urlParams?: URLParameter[]) {
    this.setAuthorizationHeaders();
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('email', email);
    if (urlParams){
      for (let urlParam of urlParams) {
        for (const value of urlParam.values)
          params = params.append(urlParam.key, value);
      }
    }
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/outbox/threads/search', {params: params, headers: headers});
  }

  getThread(id: string, groupId: string) {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    return this.httpClient.get<TopicThread>(this.apiEndpoint+`/threads/${id}`, {params: params});
  }

  setUnreadCount() {
    return this.httpClient.get<UnreadMessages>(this.apiEndpoint + '/inbox/unread').subscribe(
      res => {
        this.unreadMessages.next(res);
      },
      error => console.error(error)
    );
  }

  // newEventSource(email: string) {
  //   if (this.eventSource == null) {
  //     this.eventSource = new EventSource(this.apiEndpoint + `/stream-2/inbox/unread?email=${email}`, {withCredentials: true});
  //     this.eventSource.addEventListener('unread-threads', event => {
  //       this.unreadMessages.next(JSON.parse(event['data']));
  //     });
  //   }
  // }

  setMessageReadParam(threadId: string, messageId: string, read: boolean) {
    let params = new HttpParams();
    params = params.append('read', read);
    return this.httpClient.patch<TopicThread>(this.apiEndpoint+`/threads/${threadId}/messages/${messageId}`, null, {params: params});
  }

  postThreadPublic(thread: TopicThread, recaptcha?: string) {
    let headers = new HttpHeaders()
    if (recaptcha) {
      headers = headers.append('g-recaptcha-response', recaptcha);
    }
    return this.httpClient.post<TopicThread>(this.apiEndpoint + '/threads/public', thread, {headers: headers});
  }

  postThread(thread: TopicThread) {
    return this.httpClient.post<TopicThread>(this.apiEndpoint + '/threads', thread);
  }

  postMessage(threadId: string, message: Message, anonymous: boolean) {
    this.setAuthorizationHeaders();
    let params = new HttpParams();
    params = params.append('anonymous', anonymous);
    return this.httpClient.post<TopicThread>(this.apiEndpoint + `/threads/${threadId}/messages`, message, {params: params, headers: headers});
  }

  getGroupList() {
    return this.httpClient.get(this.apiEndpoint + '/groups');
  }

  setAuthorizationHeaders() {
    headers = headers.set('Authorization', 'Bearer ' + getCookie('AccessToken'));
  }

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
