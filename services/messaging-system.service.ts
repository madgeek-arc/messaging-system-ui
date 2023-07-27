import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Message, TopicThread, UnreadMessages} from "../app/domain/messaging";
import {getCookie} from "../../survey-tool/catalogue-ui/shared/reusable-components/cookie-management";
import {URLParameter} from "../../survey-tool/catalogue-ui/domain/url-parameter";

let headers= new HttpHeaders();

@Injectable()
export class MessagingSystemService {

  private apiEndpoint: string = environment.MESSAGING_ENDPOINT;

  constructor(private httpClient: HttpClient) {}

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

  getThread(id: string) {
    return this.httpClient.get<TopicThread>(this.apiEndpoint+`/threads/${id}`);
  }

  getUnreadCount(ids: string[]) {
    let params = new HttpParams();
    params = params.append('groups', ids.toString());
    return this.httpClient.get<UnreadMessages>(this.apiEndpoint + '/inbox/unread', {params: params});
  }

  setMessageReadParam(threadId: string, messageId: string, read: boolean) {
    let params = new HttpParams();
    params = params.append('read', read);
    return this.httpClient.patch<TopicThread>(this.apiEndpoint+`/threads/${threadId}/messages/${messageId}`, null, {params: params});
  }

  postThread(thread: TopicThread, recaptcha?: string) {
    let headers = new HttpHeaders()
    if (recaptcha) {
      headers = headers.append('g-recaptcha-response', recaptcha);
    }
    return this.httpClient.post<TopicThread>(this.apiEndpoint + '/threads', thread, {headers: headers});
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
}
