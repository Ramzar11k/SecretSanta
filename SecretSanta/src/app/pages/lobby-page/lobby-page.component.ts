import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { IMember } from 'src/app/interfaces/member.interface';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit, OnDestroy {

  data!: Observable<any>;
  unsubscribe$ = new Subject<any>();

  members: IMember[] = [];
  code = "";
  item$!: Observable<any>;

  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute, private fdb: AngularFirestore) { }

  ngOnInit(): void {
    let id: any = this.route.snapshot.paramMap.get("id");
    
    this.getLobby(id);

    let mail = {
      to: "andreim.savu@gmail.com",
      message: {
        subject: "Secret Santa",
        html: "testHtml",
        text: "testText"
      }
    };

    let a = this.fdb.collection("mail");

    //a.add({...mail});
  }

  getLobby(id: string) {
    this.data = this.db.object(`rooms/${id}`).valueChanges();
    
    this.data.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
      this.code = res.startCode;
      this.members = res.members;
    });
  }

  startGame(code: string) {
    if (code === this.code) { 
      
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
