import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogData } from '../models/dialog-data.model';
import { GeneralService } from '../services/general/general.service';
import { DialogService } from '../services/dialog/dialog.service';

@Component({
  selector: 'app-branch-dialog',
  templateUrl: './branch-dialog.component.html',
  styleUrls: ['./branch-dialog.component.scss']
})
export class BranchDialogComponent implements OnInit {
  language: string;
  isLoading: boolean = false;
  branches: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public generalService: GeneralService, public translate: TranslateService, private dialogService: DialogService) { }
  ngOnInit(): void {
    this.generalService.getLang().subscribe(lang => {
      this.language = lang;
    });
    this.isLoading = true;
    if (!!this.data) {
      this.isLoading = false;
      this.branches = this.data;
    }
  }
  openBranch(branch: any) {
    this.dialogService.restuarantDialog(branch);
  }
}
