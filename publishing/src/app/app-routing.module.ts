import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaperListComponent} from './components/paper-list/paper-list.component';

const routes: Routes = [
  {path:'', redirectTo:'news', pathMatch:'full'},
  {path:'news', component: PaperListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
