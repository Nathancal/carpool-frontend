import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import  {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';



@NgModule({
  imports: [MatProgressBarModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatDialogModule,MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule],
  exports: [MatProgressBarModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatDialogModule,MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule
  ],
})
export class MaterialModule {}
