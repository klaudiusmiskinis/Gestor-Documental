import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent, pathMatch: 'full' },
  { path: 'workspace', component: WorkspaceComponent, pathMatch: 'full' },
  { path: '**',   redirectTo: '/workspace', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
