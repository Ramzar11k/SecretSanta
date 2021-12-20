import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import * as uuid from 'uuid';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-link-page',
  templateUrl: './link-page.component.html',
  styleUrls: ['./link-page.component.scss']
})
export class LinkPageComponent implements OnInit {

  unsubscribe$ = new Subject<any>();

  name: FormControl = new FormControl("");
  email: FormControl = new FormControl("");

  form: FormGroup = new FormGroup({
    name : this.name,
    email: this.email
  });

  joined: boolean = false;

  constructor(private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id: any = this.route.snapshot.paramMap.get("id");
    
    this.getLobby(id);
  }

  getLobby(id: string) {

    let data = this.db.object(`rooms/${id}`).valueChanges();
    data.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
      if (!res) {
        this.router.navigate(["/landing"]);
      }
    });
  }

  formIsValid(): boolean {
    return true;
  }

  async submit() {
    if (this.formIsValid()) {
      let member = {
        name: this.name.value,
        email: this.email.value
      };

      await this.joinRoom(member);

      this.joined = true;
    }
  }
  
  async joinRoom(data: any) {
    let newMember = {
      id: uuid.v4(),
      name: data.name,
      email: data.email
    };


    let obj = this.db.object(`rooms/${this.route.snapshot.paramMap.get("id")}`);

    obj.valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      console.log(res);

      res.members.push(newMember);

      obj.set(res);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
