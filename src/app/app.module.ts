import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatButtonModule,
	MatCardModule,
	MatTabsModule,
	MatIconModule,
	MatSelectModule,
	MatSnackBarModule,
	MatInputModule
} from '@angular/material';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import 'rxjs/add/operator/map';
import { MnSpeechApiComponent } from './mn-speech-api/mn-speech-api.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
	{ path: 'mn-speech-api', component: MnSpeechApiComponent, data: { state: 'mn-speech-api' } },
	{ path: '', component: HomeComponent, data: { state: 'home' } },
	{ path: '**', component: AppComponent }
];

@NgModule({
	declarations: [AppComponent, MnSpeechApiComponent, HomeComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatCardModule,
		MatTabsModule,
		MatIconModule,
		MatSelectModule,
		MatSnackBarModule,
		MatInputModule,
		HttpModule,
		RouterModule.forRoot(appRoutes, { useHash: true })
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
