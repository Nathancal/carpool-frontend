import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import  {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  imports: [MatSelectModule, MatDialogModule,MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule],
  exports: [MatSelectModule, MatDialogModule,MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule
  ],
})
export class MaterialModule {}
