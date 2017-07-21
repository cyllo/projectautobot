import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClubService } from '../../../../services';

@Component({
  selector: 'ow-create-club',
  templateUrl: 'create-club.component.html',
  providers: [ClubService]
})
export class CreateClubComponent implements OnInit {

  @Output() inProgress = new EventEmitter();
  clubForm: FormGroup;

  constructor(private club: ClubService) {}

  ngOnInit() {
    this.clubForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }

  createClub({ name }) {
    this.club.create(name);
    this.inProgress.emit(false);
  }

  cancel() {
    this.clubForm.reset();
    this.inProgress.emit(false);
  }
}
