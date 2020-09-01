import { NgModule } from '@angular/core';
import {Routes, RouterModule, ExtraOptions} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {OtherPageComponent} from './other-page/other-page.component';


const routes: Routes = [
  { path: 'other', component: OtherPageComponent },
  { path: '**', component: HomeComponent },
];

const config: ExtraOptions = {
  useHash: false,
  onSameUrlNavigation: 'ignore',
  scrollPositionRestoration: 'enabled',
  enableTracing: false
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
