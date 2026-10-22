import { Injectable, NgZone } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Message, TopicThread, UnreadMessages } from "../app/domain/messaging";
import { URLParameter } from "../../survey-tool/app/domain/url-parameter";
import { BehaviorSubject, Subject } from "rxjs";
import { NewPaging } from "../app/domain/paging";

@Injectable({ providedIn: 'root' })
export class MessagingSystemService {

  private apiEndpoint: string = environment.MESSAGING_ENDPOINT;
  unreadMessages: BehaviorSubject<UnreadMessages> = new BehaviorSubject<UnreadMessages>(new UnreadMessages());
  threadChangeSubject = new Subject<TopicThread>();
  thread: TopicThread;

  constructor(private httpClient: HttpClient, private zone: NgZone) {}

  getThreads() {
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/threads');
  }

  getInbox(groupId: string, urlParams?: URLParameter[]){
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    if (urlParams){
      for (let urlParam of urlParams) {
        for (const value of urlParam.values)
          params = params.append(urlParam.key, value);
      }
    }
    return this.httpClient.get<NewPaging<TopicThread>>(this.apiEndpoint+'/inbox/threads', {params: params});
  }

  getOutbox(groupId: string, email: string, urlParams?: URLParameter[]) {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('email', email);
    if (urlParams){
      for (let urlParam of urlParams) {
        for (const value of urlParam.values)
          params = params.append(urlParam.key, value);
      }
    }
    return this.httpClient.get<NewPaging<TopicThread>>(this.apiEndpoint+'/outbox/threads', {params: params});
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
    let params = new HttpParams();
    params = params.append('anonymous', anonymous);
    return this.httpClient.post<TopicThread>(this.apiEndpoint + `/threads/${threadId}/messages`, message, {params: params});
  }

  getGroupList() {
    return this.httpClient.get(this.apiEndpoint + '/groups');
  }

  /** Setters Getters **/

  threadHasChanges(thread: TopicThread) {
    this.thread = thread;
    this.threadChangeSubject.next(thread);
  }

  getThreadAsObservable() {
    return this.threadChangeSubject.asObservable();
  }

  getCurrentThread() {
    return this.thread;
  }
}
