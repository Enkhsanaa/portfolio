import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {MatSnackBar} from '@angular/material';
import 'rxjs/Rx';
@Component({
	selector: 'app-mn-speech-api',
	templateUrl: './mn-speech-api.component.html',
	styleUrls: ['./mn-speech-api.component.scss']
})
export class MnSpeechApiComponent implements OnInit {
	flashMessage: { content: String, type: String };
	voices: Array<{ viewValue: String, value: String }> = [];
	responseWAV: String = '';
	authToken: String = '';
	speechApiStep: Number = 0;
	showLoadingBar: Boolean = false;

	constructor(private http: Http, public snackBar: MatSnackBar) {}

	ngOnInit() {
		this.flashMessage = {
			content: '',
			type: ''
		};
		this.voices.push({ viewValue: 'Цэвэлмаа', value: 'tsevelmaa' });
		this.voices.push({ viewValue: 'Оюунаа', value: 'oyunaa' });
		this.voices.push({ viewValue: 'Алтанбагана', value: 'altanbagana' });
		this.loadToken();
	}
	sendToTTS(token, voice, text) {
		this.showLoadingBar = true;
		let request = {
			url: 'https://enkhsanaa.me/tts/',
			token: token.value,
			data: { txt: text.value, voice: voice.value}
		};
		let headers = new Headers();
		headers.append('Authorization', request.token);
		headers.append('Content-Type', 'application/json');
		let reader = new FileReader();
		reader.onload = function(e) {
			window.open(decodeURIComponent(reader.result), '_self', '', false);
		};
		this.http.post(request.url, request.data, { headers: headers }).map((data: any) => data.json())
			.subscribe((data: any) => {
			this.showLoadingBar = false;
			this.showSnackbar(data.success, (data.success ? "Таныг татаж авмагц хөрвүүлсэн файл сэрвэр дээрээс устах болно." : data.message));
			if (data.success) this.responseWAV = data.fileName;
		});
	}
	sendToSTT() {}
	recoverToken(username, password) {
		this.showLoadingBar = true;
		let data = {
			username: username.value,
			password: password.value
		};

		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.http
			.post('https://enkhsanaa.me/user/forgotToken', data, { headers: headers })
			.map((data: any) => data.json())
			.subscribe((data: any) => {
				this.showLoadingBar = false;
				this.showLoadingBar = false;
				this.showSnackbar(data.success, (data.success ? data.token : data.message));
				if (data.success) this.speechApiStep = 2;
				this.storeUserData(data.token);
			});
	}
	getToken(fname, lname, phone, email, username, password, aboutProject) {
		this.showLoadingBar = true;
		let data = {
			fname: fname.value,
			lname: lname.value,
			phone: phone.value,
			email: email.value,
			username: username.value,
			password: password.value,
			aboutProject: aboutProject.value
		};

		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.http
			.post('https://enkhsanaa.me/user', data, { headers: headers })
			.map((data: any) => data.json())
			.subscribe((data: any) => {
				this.showLoadingBar = false;
				this.showSnackbar(data.success, (data.success ? data.token : data.message));
				if (data.success) this.speechApiStep = 2;
				this.storeUserData(data.token);
			});
	}
	loadToken() {
		const token = localStorage.getItem('mnSpeechAPIToken') || '';
		this.authToken = token;
		if (token != '') this.speechApiStep = 2;
	}
	storeUserData(token) {
		localStorage.setItem('mnSpeechAPIToken', token);
		this.authToken = token;
	}
	tabChanged = (idx) => {
		if (idx != this.speechApiStep) this.speechApiStep = Number(idx);
	}
	showSnackbar(success: boolean, message: String) {
		this.snackBar.open((success ? 'Амжилттай! ' : 'Алдаа! ') + message, null, {
			duration: 20000,
			verticalPosition: 'top',
			extraClasses: ['mt-3', 'alert', 'alert-' + (success ? 'success' : 'danger'), 'text-center']
		});
	}
}
