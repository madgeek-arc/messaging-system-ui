import {Route, Routes} from "@angular/router";
import {RECAPTCHA_V3_SITE_KEY} from "ng-recaptcha-2";
import {environment} from "../../environments/environment";
import {MessagingWebsocketService} from "../services/messaging-websocket.service";
import {ContactComponent} from "./pages/contact/contact.component";
import {MessagesComponent} from "./pages/messages/messages.component";
import {ThreadComponent} from "./pages/thread/thread.component";

// The contact page needs the reCAPTCHA site key, which the module used to provide for all its pages
const contactRoute: Route = {
  component: ContactComponent,
  providers: [{provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.RECAPTCHA_V3_KEY}]
};

/** Only the contact page, for a host that mounts it on its own path, e.g. `contact` */
export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    ...contactRoute
  }
];

/** The whole module, for a host that mounts it under a group, e.g. `contributions/:id` */
export const MESSAGING_SYSTEM_ROUTES: Routes = [
  {
    path: 'contact',
    ...contactRoute
  },
  {
    path: '',
    // The thread page joins the thread's socket through its own instance of the service
    providers: [MessagingWebsocketService],
    children: [
      {
        path: 'messages',
        component: MessagesComponent
      },
      {
        path: 'messages/:threadId',
        component: ThreadComponent
      }
    ]
  }
];
