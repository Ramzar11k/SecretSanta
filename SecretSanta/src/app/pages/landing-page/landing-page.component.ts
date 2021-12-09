import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { IMember } from 'src/app/interfaces/member.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import * as uuid from 'uuid';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  name: FormControl = new FormControl("");
  email: FormControl = new FormControl("");

  form: FormGroup = new FormGroup({
    name : this.name,
    email: this.email
  });
  
  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngOnInit(): void {
  }

  formIsValid(): boolean {
    return true;
  }

  async submit() {
    if (this.formIsValid()) {
      let member: IMember = {
        id: uuid.v4(),
        name: this.name.value,
        email: this.email.value,
        ignoredMembers: []
      };

      await this.createNewRoom(member);
    }
  }

  async createNewRoom(memberData: any) {
    let room: IRoom = {
      members: [memberData],
      status: "",
      startCode: this.generateStartCode()
    }

    let newRoomId = this.db.createPushId();

    let obj = this.db.object(`rooms/${newRoomId}`);

    await obj.update(room);

    this.router.navigate([`lobby/${newRoomId}`]);
  }

  generateStartCode(): string {
    const numbers = "0123456789";
    let code = "";

    for (let i = 0; i < 4; i++) {
      code += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return code;
  }
}
