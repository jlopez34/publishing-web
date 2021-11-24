import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Paper } from 'src/app/models/paper.model';
import { PaperService } from "../../services/paper.service";


 @Component({
  selector: 'app-paper-list',
  styleUrls: ['./paper-list.component.css'],
  templateUrl: './paper-list.component.html',
})
export class PaperListComponent implements AfterViewInit {
  displayedColumns: string[] = ['title', 'author', 'created_at', 'remove' ];

  data: Paper[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator)
   paginator!: MatPaginator;
  @ViewChild(MatSort)
   sort!: MatSort;

  constructor(private _paperService: PaperService) {}

  ngAfterViewInit() {
  
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this._paperService.getAll()
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this._paperService.getAll().pipe(catchError(() => observableOf(null)));
        }),
        map(data => {

          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.length;
          return data;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  onRemove(row: any) {
    console.log('Row clicked to be removed: ', row);
    this._paperService.remove(row)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.ngAfterViewInit();
        },
        error: (e) => console.error(e)
      });
  }
}
