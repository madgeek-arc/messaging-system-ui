import {NgModule} from "@angular/core";
import {ContactComponent} from "./pages/contact/contact.component";
import {MessagingSystemRoutingModule} from "./messaging-system-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings} from "ng-recaptcha";
import {MessagesComponent} from "./pages/messages/messages.component";
import {ThreadComponent} from "./pages/thread/thread.component";
import {RouterModule} from "@angular/router";
import {MessagingSystemService} from "../services/messaging-system.service";
import {EmailComposeComponent} from "./pages/emailCompose/email-compose.component";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";


const RECAPTCHA_V2_DUMMY_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

@NgModule({
  declarations:[
    ContactComponent,
    MessagesComponent,
    ThreadComponent,
    EmailComposeComponent
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: RECAPTCHA_V2_DUMMY_KEY
      } as RecaptchaSettings
    },
    MessagingSystemService
  ],
  imports: [
    CommonModule,
    MessagingSystemRoutingModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RouterModule,
    CKEditorModule,
    FormsModule
  ],
  exports: []
})

export class MessagingSystemModule {}
