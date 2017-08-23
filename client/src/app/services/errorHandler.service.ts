import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class ErrorHandlerService {

  constructor(private snackBar: MdSnackBar) {}

  show(e: string): void {
    this.snackBar.open(e, 'ok', {
      duration: 3500
    });
  }

}
