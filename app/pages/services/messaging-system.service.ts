import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {TopicThread} from "../../domain/messaging";

@Injectable()

export class MessagingSystemService {

  private apiEndpoint: string = environment.MESSAGING_ENDPOINT;

  constructor(private httpClient: HttpClient) {}

  getThreads() {
    return this.httpClient.get<TopicThread[]>(this.apiEndpoint+'/threads');
  }

}
