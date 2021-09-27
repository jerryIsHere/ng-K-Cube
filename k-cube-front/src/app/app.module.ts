import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterPipe } from './util/filter.pipe';
import { FlatMapPipe } from './util/flat-map.pipe';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { NgxEchartsModule } from 'ngx-echarts';
import { TheGraphComponent } from './page/the-graph/the-graph.component';
import { AllCoursesComponent } from './page/all-courses/all-courses.component';
import { MyDriveComponent } from './page/my-drive/my-drive.component';
import { DeveloperBoardComponent } from './page/developer-board/developer-board.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { LoginFormComponent } from './form/login-form/login-form.component';
import { ContributorFormComponent } from './form/contributor-form/contributor-form.component';
import { CourseFormComponent } from './form/course-form/course-form.component';
import { IfElsePipe } from './util/if-else.pipe';
import { IfEqualElsePipe } from './util/if-equal-else.pipe';
import { IfNotEqualElsePipe } from './util/if-not-equal-else.pipe';
import { GraphEditorComponent } from './page/graph-editor/graph-editor.component';
import { ScheduleEditorComponent } from './page/schedule-editor/schedule-editor.component';
import { TripleFormComponent } from './form/triple-form/triple-form.component';
import { TeachingFormComponent } from './form/teaching-form/teaching-form.component';
import { FilePathBarComponent } from './gadget/file-path-bar/file-path-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    FlatMapPipe,
    TheGraphComponent,
    AllCoursesComponent,
    MyDriveComponent,
    LoginFormComponent,
    DeveloperBoardComponent,
    ContributorFormComponent,
    CourseFormComponent,
    IfElsePipe,
    IfEqualElsePipe,
    IfNotEqualElsePipe,
    GraphEditorComponent,
    ScheduleEditorComponent,
    TripleFormComponent,
    TeachingFormComponent,
    FilePathBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatDividerModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    MatAutocompleteModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
