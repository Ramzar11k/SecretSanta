import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';
import { LinkPageComponent } from './pages/link-page/link-page.component';
import { AngularFireModule } from"@angular/fire/compat";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const config = {
  apiKey: "AIzaSyDP8DIJMozCg2BjSpxs-4rU6ErNBbM7OTQ",
  authDomain: "secretsanta-bd7a9.firebaseapp.com",
  databaseURL: "https://secretsanta-bd7a9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "secretsanta-bd7a9",
  storageBucket: "secretsanta-bd7a9.appspot.com",
  messagingSenderId: "502562206791",
  appId: "1:502562206791:web:7915e5eed1faed76e2ad62",
  measurementId: "G-YZGZPQMKZ0"
};

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LobbyPageComponent,
    LinkPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
