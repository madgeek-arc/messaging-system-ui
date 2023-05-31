import {NgModule} from "@angular/core";
import {ContactComponent} from "./pages/contact/contact.component";
import {MessagingSystemRoutingModule} from "./messaging-system-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from "ng-recaptcha";
import {MessagesComponent} from "./pages/messages/messages.component";
import {ThreadComponent} from "./pages/thread/thread.component";
import {RouterModule} from "@angular/router";
import {MessagingSystemService} from "../services/messaging-system.service";
import {EmailComposeComponent} from "./pages/emailCompose/email-compose.component";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {NgSelectModule} from "@ng-select/ng-select";


const RECAPTCHA_V3_KEY = '6Lc_SFEmAAAAAPULH3Rw_Umpa-UVJ2n1qJ0dOcJ7';

@NgModule({
  declarations:[
    ContactComponent,
    MessagesComponent,
    ThreadComponent,
    EmailComposeComponent
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: RECAPTCHA_V3_KEY
    },
    MessagingSystemService
  ],
  imports: [
    CommonModule,
    MessagingSystemRoutingModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    RouterModule,
    CKEditorModule,
    FormsModule,
    NgSelectModule
  ],
  exports: []
})

export class MessagingSystemModule {}
