import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LinkPageComponent } from './pages/link-page/link-page.component';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';

const routes: Routes = [
  {path: "", redirectTo: "/landing", pathMatch: "full"},
  {path: "landing", component: LandingPageComponent},
  {path: "lobby/:id", component: LobbyPageComponent},
  {path: "join/:id", component: LinkPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
