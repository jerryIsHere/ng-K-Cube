import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheGraphComponent } from './page/the-graph/the-graph.component';
import { AllCoursesComponent } from './page/all-courses/all-courses.component';
import { MyDriveComponent } from './page/my-drive/my-drive.component';
import { DeveloperBoardComponent } from './page/developer-board/developer-board.component';
import { GraphEditorComponent } from './page/graph-editor/graph-editor.component';
import { ScheduleEditorComponent } from './page/schedule-editor/schedule-editor.component';
const routes: Routes = [
  { path: '', redirectTo: 'the-graph', pathMatch: 'full' },
  { path: 'the-graph', component: TheGraphComponent },
  { path: 'all-courses', component: AllCoursesComponent },
  { path: 'my-drive', component: MyDriveComponent },
  { path: 'developer-board', component: DeveloperBoardComponent },
  { path: 'graph-editor', component: GraphEditorComponent },
  { path: 'schedule-editor', component: ScheduleEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
