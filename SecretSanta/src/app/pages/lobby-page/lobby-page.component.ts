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

  dab: any;

  selectingIgnore: boolean = false;

  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute, private fdb: AngularFirestore) { }

  ngOnInit(): void {
    let id: any = this.route.snapshot.paramMap.get("id");
    this.getLobby(id);
  }

  getLobby(id: string) {
    this.data = this.db.object(`rooms/${id}`).valueChanges();
    
    this.dab = this.db.object(`rooms/${id}`);

    console.log(this.dab);
    
    this.data.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
      this.code = res.startCode;
      this.members = res.members;
    });

    
  }

  startGame(code: string) {
    if (code !== this.code) { return; }

    let correct = false;
    let attempts = 100;

    while (attempts > 0 && correct === false) {
      correct = true;
      console.log(attempts);
      for (let i = 0; i < 1000; i++) {
        let rand1 = Math.floor(Math.random() * this.members.length);
        let rand2 = Math.floor(Math.random() * this.members.length);
  
        if (rand1 === rand2) { continue; }
  
        let temp: IMember = this.members[rand1];
        this.members[rand1] = this.members[rand2];
        this.members[rand2] = temp;
      }
  
      for (let i = 0; i < this.members.length - 1; i++) {
        if (!this.members[i].ignoredMembers) { continue; }
        if (this.members[i].ignoredMembers.includes(this.members[i + 1].id)) { correct = false; }
  
      }
  
      if (this.members[this.members.length - 1].ignoredMembers && this.members[this.members.length - 1].ignoredMembers.includes(this.members[0].id)) { 
        correct = false; 
      }      

      attempts--;
    }
    

    if (attempts === 0) { console.log("err"); }
    
    console.log(attempts);
    if (!correct) { 
      console.log("WRONG");
    }

    else {
      for (let i = 0; i < this.members.length - 1; i++) {
        this.sendMail(this.members[i].email, this.members[i + 1].name);
      }

      this.sendMail(this.members[this.members.length - 1].email, this.members[0].name);
    }
    console.log(this.members);

  }

  failSafe() {
    for (let i = 0; i < this.members.length - 1; i++) {
      this.sendMail(this.members[i].email, this.members[i + 1].name);
    }

    this.sendMail(this.members[this.members.length - 1].email, this.members[0].name);
  }

  sendMail(email: string, receiver: string) {
    let mail = {
      to: email,
      message: {
        subject: "Secret Santa",
        html: `Buna frumosule/frumoaso, mosul nu stie cum sa formateze un text in mail asa ca spera ca arata ok. Persoana careia va trebuii sa ii iei cadou este: ${receiver}. Mosul a zis ca putem stabili un buget intre noi, el nu e familiar cu unul in acest moment. Pupici 😘`,
        text: "nu stiu unde e textul asta"
      }
    };

    let a = this.fdb.collection("mail");

    a.add({...mail});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  firstMember: IMember | null = null;

  test(member: IMember): void {
    if (!this.selectingIgnore) {
      this.selectingIgnore = true;
      this.firstMember = member;
      this.firstMember["ignoredMembers"] = [];
    }

    else {
      console.log(this.firstMember);
      this.firstMember?.ignoredMembers.push(member.id);
      this.selectingIgnore = false;
      this.firstMember = null;
      console.log(this.members);
    }
    let m = this.db.object(`rooms/${this.route.snapshot.paramMap.get("id")}`);

    m.update({members: this.members});
  }
}
