import { Component, AfterContentInit, ViewChild } from '@angular/core';
import { UserFriendsListClub, User } from '../../../../models';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../../services';

@Component({
  selector: 'ow-global-sidebar-left-friends-list',
  templateUrl: 'global-sidebar-left-friends-list.component.html',
  styleUrls: ['global-sidebar-left-friends-list.component.scss'],
  providers: [UserService]
})

export class GlobalSideBarLeftFriendsListComponent implements AfterContentInit {
  @ViewChild('search') search;
  openSearchResults: boolean;
  clubCreationPending: boolean;
  responseMessage: string;
  questionForm: FormGroup;
  searchResults: User[];
  private player: any;
  private fieldName = 'Search';
  private controlName = 'search';
  private searchPlaceholder = 'Search for friends by display name';

  clubs: UserFriendsListClub[] = [
    {
      name: 'High Elo Team mates',
      mutable: true
    },
    {
      name: 'Crew',
      mutable: true
    },
    {
      name: 'General',
      mutable: false
    }
  ];

  constructor(private userService: UserService) {
    this.clubCreationPending = false;
    this.openSearchResults = false;
  }

  ngAfterContentInit() {
    this.questionForm = new FormGroup({});

      this.search.initControl(
      this.questionForm,
      this.player,
      this.fieldName,
      this.controlName,
      this.searchPlaceholder,
      true
    );
    this.mapFormToModel();
  }

  clubCreationStarted(): void {
    this.clubCreationPending = true;
  }

  clubCreationEnded(): void {
    this.clubCreationPending = false;
    this.setResponseMessage();
  }

  private setResponseMessage(): void {
    this.responseMessage = 'Color coated response message.';
    setTimeout(() => { this.responseMessage = null; }, 1500);
  }

  private mapFormToModel() {
    this.search = this.questionForm.getRawValue();
  }

  onSearch(displayName) {
    this.userService.find(displayName)
    .subscribe(users => {
      this.searchResults = users;
      this.openSearchResults = true;
    });
  }
}
