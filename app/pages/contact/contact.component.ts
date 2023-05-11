import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
import {TopicThread} from "../../domain/messaging";

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html'
})

export class ContactComponent implements OnInit {

  newThread: TopicThread = null;

  contactForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    surname: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
    affiliation: new FormControl(null),
    subject: new FormControl(null),
    about: new FormControl(null, Validators.required),
    country: new FormControl(null, Validators.required),
    message: new FormControl(null, Validators.required),
    termsAndConditions: new FormControl(null, Validators.requiredTrue)
  });

  recaptchaForm: FormGroup = new FormGroup({
    recaptcha: new FormControl(null, Validators.required),
  });

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
    return this.contactForm.get(fieldName).invalid && this.contactForm.get(fieldName).touched
  }

  sendMessage() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    } else {
      console.log('Sending message');
      // this.newThread.messages[0].body =
    }
  }

  resolved(message: string, token: string | null) {
    console.log((`${message}: ${token}`));
  }

}
