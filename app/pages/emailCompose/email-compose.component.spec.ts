import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';
import { RichTextEditorComponent } from '../../../../survey-tool/catalogue-ui/shared/reusable-components/rich-text-editor/rich-text-editor.component';
import { EmailComposeComponent } from './email-compose.component';

describe('EmailComposeComponent', () => {
  let http: HttpTestingController;

  const create = () => {
    sessionStorage.setItem('userInfo', JSON.stringify({user: {fullname: 'Test User', email: 'tester@example.org'}}));
    const fixture = TestBed.createComponent(EmailComposeComponent);
    fixture.detectChanges();
    http.expectOne(`${environment.MESSAGING_ENDPOINT}/groups`).flush({});
    return fixture;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailComposeComponent],
      imports: [FormsModule, ReactiveFormsModule, NgSelectModule, RichTextEditorComponent],
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.removeItem('userInfo');
  });

  it('asks for a recipient instead of sending when none was chosen', () => {
    const component = create().componentInstance;

    component.recipients = null;
    component.createTread();
    expect(component.noRecipients()).toBeTrue();

    component.recipients = [];
    component.createTread();
    expect(component.noRecipients()).toBeTrue();

    http.expectNone(`${environment.MESSAGING_ENDPOINT}/threads`);
  });

  it('sends the thread once a recipient is chosen', () => {
    const component = create().componentInstance;

    component.recipients = [{id: 'g1', name: 'Group One', type: 'groupId'}];
    component.createTread();

    expect(component.noRecipients()).toBeFalse();
    const req = http.expectOne(`${environment.MESSAGING_ENDPOINT}/threads`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.to[0].groupId).toBe('g1');
  });
});
