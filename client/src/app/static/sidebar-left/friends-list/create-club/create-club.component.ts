import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClubService } from '../../../../services';
import { Subject } from 'rxjs/Subject';

interface CreateClubForm {
  name: string;
}

@Component({
  selector: 'ow-create-club',
  templateUrl: 'create-club.component.html',
  styleUrls: ['create-club.component.scss'],
  providers: [ClubService]
})
export class CreateClubComponent implements OnInit, OnDestroy {

  @Output() inProgress = new EventEmitter();
  createClub$ = new Subject<CreateClubForm>();
  cancel$ = new Subject();
  destroyer$ = new Subject();
  clubForm: FormGroup;

  constructor(private club: ClubService) {}

  ngOnInit() {
    this.clubForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });

    this.createClub$
    .do(({ name }) => this.club.create(name))
    .takeUntil(this.destroyer$)
    .subscribe(() => this.inProgress.emit(false));

    this.cancel$
    .takeUntil(this.destroyer$)
    .subscribe(() => {
      this.clubForm.reset();
      this.inProgress.emit(false);
    });
  }

  ngOnDestroy() {
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}
