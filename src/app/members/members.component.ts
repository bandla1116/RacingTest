import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members = [];

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
    this.appService.getMembers().subscribe(members => (this.members = members));
  }

  goToAddMemberForm() {
    this.router.navigate(['/addMember']);
  }

  editMemberByID(id: number, obj: any) {
    this.appService.editMemberByID(id, obj).subscribe((response) => {
      console.log(response);
    })
  }

  deleteMemberById(member) {
    this.appService.deleteMember(member.id).subscribe((response) => (console.log(response)));
  }
}
