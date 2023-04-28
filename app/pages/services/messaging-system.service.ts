import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()

export class MessagingSystemService {

  private apiEndpoint: string = null;

  constructor(private httpClient: HttpClient) {}

  getThreads() {
    return
  }

}
