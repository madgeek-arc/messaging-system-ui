import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Message, TopicThread} from "../app/domain/messaging";

@Injectable()

export class MessagingSystemService {

  private apiEndpoint: string = environment.MESSAGING_ENDPOINT;

  constructor(private httpClient: HttpClient) {}

  getThreads() {
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/threads');
  }

  getInbox(groupId: string){
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/inbox/threads/search', {params: params});
  }

  getOutbox(groupId: string, email: string) {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('email', email);
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/outbox/threads/search', {params: params});
  }

  getThread(id: string) {
    return this.httpClient.get<TopicThread>(this.apiEndpoint+`/threads/${id}`);
  }

  setMessageReadParam(threadId: string, messageId: string, read: boolean) {
    let params = new HttpParams();
    params = params.append('read', read);
    return this.httpClient.patch(this.apiEndpoint+`/threads/${threadId}/messages/${messageId}`, null, {params: params});
  }

  postThread(thread: TopicThread) {
    return this.httpClient.post<TopicThread>(this.apiEndpoint + '/threads', thread);
  }

  postMessage(threadId: string, message: Message, anonymous: boolean) {
    let params = new HttpParams();
    params = params.append('anonymous', anonymous);
    return this.httpClient.post<TopicThread>(this.apiEndpoint + `/threads/${threadId}/messages`, message, {params: params});
  }

}
