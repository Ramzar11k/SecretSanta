import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit, OnDestroy {

  data!: Observable<any>;
  unsubscribe$ = new Subject<any>();

  members = [];
  code = "";

  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id: any = this.route.snapshot.paramMap.get("id");
    
    this.getLobby(id);
  }

  getLobby(id: string) {
    this.data = this.db.object(`rooms/${id}`).valueChanges();
    
    this.data.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
      console.log(res);
      this.code = res.startCode;
      this.members = res.members;
    });
  }

  startGame(code: string) {
    if (code === this.code) { console.log("DING"); }
    else { console.log("g"); }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
