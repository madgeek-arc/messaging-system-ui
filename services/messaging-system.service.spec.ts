import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Message } from '../app/domain/messaging';
import { MessagingSystemService } from './messaging-system.service';

describe('MessagingSystemService', () => {
  const api = environment.MESSAGING_ENDPOINT;
  let service: MessagingSystemService;
  let http: HttpTestingController;

  beforeEach(() => {
    // A leftover cookie must not turn into a header
    document.cookie = 'AccessToken=secret-value';
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    service = TestBed.inject(MessagingSystemService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    document.cookie = 'AccessToken=; Max-Age=-99999999;';
  });

  it('reads the inbox without an Authorization header', () => {
    service.getInbox('g1', [{key: 'page', values: ['2']}]).subscribe();

    const req = http.expectOne(r => r.url === `${api}/inbox/threads`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('groupId')).toBe('g1');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('reads the outbox without an Authorization header', () => {
    service.getOutbox('g1', 'user@example.org').subscribe();

    const req = http.expectOne(r => r.url === `${api}/outbox/threads`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('groupId')).toBe('g1');
    expect(req.request.params.get('email')).toBe('user@example.org');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('posts a reply without an Authorization header', () => {
    service.postMessage('t1', {} as Message, true).subscribe();

    const req = http.expectOne(r => r.url === `${api}/threads/t1/messages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.params.get('anonymous')).toBe('true');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});
