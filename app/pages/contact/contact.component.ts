import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TopicThread} from "../../domain/messaging";
import {MessagingSystemService} from "../../../services/messaging-system.service";

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html'
})

export class ContactComponent implements OnInit {

  newThread: TopicThread = new TopicThread();

  contactForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    surname: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
    affiliation: new FormControl(null),
    subject: new FormControl(null, Validators.required),
    about: new FormControl(null, Validators.required),
    country: new FormControl(null, Validators.required),
    message: new FormControl(null, Validators.required),
    termsAndConditions: new FormControl(null, Validators.requiredTrue)
  });

  recaptchaForm: FormGroup = new FormGroup({
    recaptcha: new FormControl(null, Validators.required),
  });

  sendSuccess: boolean = null;
  display: number = 0;
  public timerInterval: any;

  constructor(private messagingService: MessagingSystemService, private router: Router) {
  }

  ngOnInit() {
    this.contactForm.get('country').disable();
    this.contactForm.get('about').valueChanges.subscribe(
      value => {
        if (value === 'Country data') {
          this.contactForm.get('country').enable();
        } else {
          this.contactForm.get('country').disable();
        }
      }
    );
  }

  formFieldInvalid(fieldName: string) {
    return this.contactForm.get(fieldName).invalid && this.contactForm.get(fieldName).touched;
  }

  sendMessage() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    } else {
      console.log('Sending message');
      this.newThread.messages[0].body = this.contactForm.get('message').value;
      this.newThread.subject = this.contactForm.get('subject').value;
      this.newThread.from.name = this.contactForm.get('name').value + ' ' + this.contactForm.get('surname').value;
      this.newThread.from.email = this.contactForm.get('email').value;
      if (this.contactForm.get('about').value === 'Country data') {
        this.newThread.to[0].groupId = 'sh-country-' + this.contactForm.get('country').value;
        this.newThread.messages[0].to[0].groupId = 'sh-country-' + this.contactForm.get('country').value;
      } else {
        this.newThread.to[0].groupId = this.contactForm.get('about').value;
        this.newThread.messages[0].to[0].groupId = this.contactForm.get('about').value;
      }
      this.newThread.messages[0].from.name = this.contactForm.get('name').value + ' ' + this.contactForm.get('surname').value;
      this.newThread.messages[0].from.email = this.contactForm.get('email').value;

      this.messagingService.postThread(this.newThread).subscribe(
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

}
