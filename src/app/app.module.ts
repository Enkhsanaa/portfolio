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
	MatProgressBarModule,
	MatInputModule
} from '@angular/material';
import { Http, HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import 'rxjs/add/operator/map';
import { MnSpeechApiComponent } from './mn-speech-api/mn-speech-api.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SchedlyComponent } from './schedly/schedly.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'mn-speech-api', component: MnSpeechApiComponent, data: { state: 'mn-speech-api' } },
	{ path: 'schedly', component: SchedlyComponent, data: { state: 'schedly' } },
	{ path: 'home', component: HomeComponent, data: { state: 'home' } }
];

@NgModule({
	declarations: [AppComponent, MnSpeechApiComponent, HomeComponent, SchedlyComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatCardModule,
		MatTabsModule,
		MatIconModule,
		MatSelectModule,
		MatSnackBarModule,
		MatProgressBarModule,
		MatInputModule,
		HttpModule,
		RouterModule.forRoot(appRoutes, { useHash: true })
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
