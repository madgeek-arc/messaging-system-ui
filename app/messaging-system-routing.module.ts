import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ContactComponent} from "./pages/contact/contact.component";

const messagingSystemRoutes: Routes = [
  {
    path: 'contact',
    component: ContactComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(messagingSystemRoutes)],
  exports: [RouterModule]
})

export class MessagingSystemRoutingModule {}
