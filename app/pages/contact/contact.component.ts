import {Component, OnDestroy, OnInit} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TopicThread} from "../../domain/messaging";
import {MessagingSystemService} from "../../../services/messaging-system.service";
import {SurveyService} from "../../../../survey-tool/app/services/survey.service";
import {OnExecuteData, OnExecuteErrorData, ReCaptchaV3Service} from "ng-recaptcha";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
  styles: ['.grecaptcha-badge { visibility: hidden !important;}']
})

export class ContactComponent implements OnInit, OnDestroy {

  newThread: TopicThread = new TopicThread();

  contactForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(null, Validators.required),
    surname: new UntypedFormControl(null, Validators.required),
    email: new UntypedFormControl(null, Validators.compose([Validators.required, Validators.email])),
    affiliation: new UntypedFormControl(null),
    subject: new UntypedFormControl(null, Validators.required),
    about: new UntypedFormControl(null, Validators.required),
    country: new UntypedFormControl(null, Validators.required),
    coordinator: new UntypedFormControl(null, Validators.required),
    message: new UntypedFormControl(null, Validators.required),
    termsAndConditions: new UntypedFormControl(null, Validators.requiredTrue)
  });

  groups: {} = null;
  sendSuccess: boolean = null;
  display: number = 0;
  timerInterval: any;

  // reCaptcha
  recentToken = "";
  recentError?: { error: any };
  readonly executionLog: Array<OnExecuteData | OnExecuteErrorData> = [];

  private allExecutionsSubscription: Subscription;
  private allExecutionErrorsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;

  constructor(private messagingService: MessagingSystemService, private recaptchaV3Service: ReCaptchaV3Service,
              private surveyService: SurveyService, private router: Router) {
  }

  ngOnInit() {
    this.messagingService.getGroupList().subscribe(
      res=> {this.groups = res;},
      error => {console.error(error)}
    );

    this.allExecutionsSubscription = this.recaptchaV3Service.onExecute.subscribe((data) =>
      this.executionLog.push(data),
    );
    this.allExecutionErrorsSubscription = this.recaptchaV3Service.onExecuteError.subscribe((data) =>
      this.executionLog.push(data),
    );

    this.contactForm.get('country').disable();
    this.contactForm.get('coordinator').disable();
    this.contactForm.get('about').valueChanges.subscribe(
      value => {
        if (value === 'Country Data') {
          this.contactForm.get('country').enable();
          this.contactForm.get('coordinator').disable();
        } else if (value === 'Survey Improvements') {
          this.contactForm.get('coordinator').enable();
          this.contactForm.get('country').disable();
        } else {
          this.contactForm.get('coordinator').disable();
          this.contactForm.get('country').disable();
        }
      }
    );

    const badge = document.getElementsByClassName('grecaptcha-badge')[0];
    if (badge && badge instanceof HTMLElement) {
      badge.style.visibility = 'visible';
    }
  }

  formFieldInvalid(fieldName: string) {
    return this.contactForm.get(fieldName).invalid && this.contactForm.get(fieldName).touched;
  }

  sendMessage() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    } else {
      // console.log('Sending message');
      this.newThread.messages[0].body = this.contactForm.get('message').value;
      this.newThread.subject = this.contactForm.get('subject').value;
      this.newThread.from.name = this.contactForm.get('name').value + ' ' + this.contactForm.get('surname').value;
      this.newThread.from.email = this.contactForm.get('email').value;
      if (this.contactForm.get('about').value === 'Country Data') {
        this.newThread.to[0].groupId = this.contactForm.get('country').value;
        this.newThread.messages[0].to[0].groupId = this.contactForm.get('country').value;
      } else if (this.contactForm.get('about').value === 'Survey Improvements') {
        this.newThread.to[0].groupId = this.contactForm.get('coordinator').value;
        this.newThread.messages[0].to[0].groupId = this.contactForm.get('coordinator').value;
      } else {
        this.newThread.to[0].groupId = this.contactForm.get('about').value;
        this.newThread.messages[0].to[0].groupId = this.contactForm.get('about').value;
      }
      this.newThread.messages[0].from.name = this.contactForm.get('name').value + ' ' + this.contactForm.get('surname').value;
      this.newThread.messages[0].from.email = this.contactForm.get('email').value;

      this.messagingService.postThreadPublic(this.newThread, this.recentToken).subscribe(
        res=> {
          this.sendSuccess = true;
          this.timer(0.1);
        },
        error => {console.error(error)}
      );

    }
  }

  resolved(message: string, token: string | null) {
    console.log((`${message}: ${token}`));
  }

  executeAction(action: string): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.singleExecutionSubscription = this.recaptchaV3Service.execute(action).subscribe(
      (token) => {
        this.recentToken = token;
        this.recentError = undefined;
      },
      (error) => {
        this.recentToken = "";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.recentError = { error };
      },
    );
  }

  timer(minute) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      // if (statSec != 0) statSec--;
      // else statSec = 59;
      //
      // if (statSec < 10) {
      //   textSec = '0' + statSec;
      // } else textSec = statSec;

      // this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      this.display = seconds;

      if (seconds == -1) {
        // console.log('finished');
        clearInterval(this.timerInterval);
        this.router.navigate(['/home']);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.allExecutionsSubscription) {
      this.allExecutionsSubscription.unsubscribe();
    }
    if (this.allExecutionErrorsSubscription) {
      this.allExecutionErrorsSubscription.unsubscribe();
    }
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }

    const badge = document.getElementsByClassName('grecaptcha-badge')[0];
    if (badge && badge instanceof HTMLElement) {
      badge.style.visibility = 'hidden';
    }
  }

}
