import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TopicThread} from "../domain/messaging";

@Injectable()

export class MessagingSystemService {

  private apiEndpoint: string = environment.MESSAGING_ENDPOINT;

  constructor(private httpClient: HttpClient) {}

  getThreads() {
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/threads');
  }

  getThread(id: string) {
    return this.httpClient.get<TopicThread>(this.apiEndpoint+`/threads/${id}`);
  }

  setMessageReadParam(threadId: string, messageId: string, read: boolean) {
    let params = new HttpParams();
    params = params.append('read', read);
    return this.httpClient.patch(this.apiEndpoint+`/threads/${threadId}/messages/${messageId}`, null, {params: params});
  }

}
