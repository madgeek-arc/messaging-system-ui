import {NgModule} from "@angular/core";
import {ContactComponent} from "./pages/contact/contact.component";
import {MessagingSystemRoutingModule} from "./messaging-system-routing.module";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings} from "ng-recaptcha";


const RECAPTCHA_V2_DUMMY_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

@NgModule({
  declarations:[
    ContactComponent
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: RECAPTCHA_V2_DUMMY_KEY
      } as RecaptchaSettings
    }
  ],
  imports: [
    CommonModule,
    MessagingSystemRoutingModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  exports: []
})

export class MessagingSystemModule {}
