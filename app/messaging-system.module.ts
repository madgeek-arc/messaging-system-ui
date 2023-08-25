import {NgModule} from "@angular/core";
import {ContactComponent} from "./pages/contact/contact.component";
import {MessagingSystemRoutingModule} from "./messaging-system-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from "ng-recaptcha";
import {MessagesComponent} from "./pages/messages/messages.component";
import {ThreadComponent} from "./pages/thread/thread.component";
import {RouterModule} from "@angular/router";
import {MessagingSystemService} from "src/messaging-system-ui/services/messaging-system.service";
import {EmailComposeComponent} from "./pages/emailCompose/email-compose.component";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {NgSelectModule} from "@ng-select/ng-select";

import {environment} from "../../environments/environment";
import {MessagingWebsocketService} from "../services/messaging-websocket.service";

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
      useValue: environment.RECAPTCHA_V3_KEY
    },
    // MessagingSystemService,
    MessagingWebsocketService
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
