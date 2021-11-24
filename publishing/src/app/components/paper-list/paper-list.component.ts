import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Paper } from 'src/app/models/paper.model';
import { PaperService } from "../../services/paper.service";
/**
 * @title Table retrieving data through HTTP
 */
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
  
    // If the user changes the sort order, reset back to the first page.
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
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          return data;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}
