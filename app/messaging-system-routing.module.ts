import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ContactComponent} from "./pages/contact/contact.component";
import {MessagesComponent} from "./pages/messages/messages.component";
import {ThreadComponent} from "./pages/tread/thread.component";

const messagingSystemRoutes: Routes = [
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: '',
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
]

@NgModule({
  imports: [RouterModule.forChild(messagingSystemRoutes)],
  exports: [RouterModule]
})

export class MessagingSystemRoutingModule {}
