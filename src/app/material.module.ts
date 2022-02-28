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
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';




@NgModule({
  imports: [MatAutocompleteModule, MatListModule, MatDividerModule, MatButtonModule, MatTabsModule, MatProgressBarModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatDialogModule,MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule],
  exports: [MatAutocompleteModule, MatListModule, MatDividerModule, MatButtonModule, MatTabsModule, MatProgressBarModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatDialogModule,MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule
  ],
})
export class MaterialModule {}
