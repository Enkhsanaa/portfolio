import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatButtonModule,
	MatCardModule,
	MatMenuModule,
	MatToolbarModule,
	MatIconModule,
	MatSnackBarModule,
	MatInputModule,
	MatSidenavModule
} from '@angular/material';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import 'rxjs/add/operator/map';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatCardModule,
		MatMenuModule,
		MatToolbarModule,
		MatIconModule,
		MatSnackBarModule,
		MatInputModule,
		MatSidenavModule,
		HttpModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
