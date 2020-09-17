import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

class Members {
  firstName= ['', Validators.required];
  lastName = ['', Validators.required];
  jobTitle = ['', Validators.required];
  team = ['', Validators.required];
  status= ['', Validators.required];;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.memberForm = this.fb.group(new Members());
  }

  ngOnInit() {
    this.appService.getTeams().subscribe(teams => (this.teams = teams));
    console.log(this.teams);
  }

  ngOnChanges() {}

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
    this.appService.addMember(this.memberModel).subscribe((response) => {
      console.log(response);
      this.router.navigate(['/members']);
    })
  }
}
