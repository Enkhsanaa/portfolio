import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';
@Component({
	selector: 'app-mn-speech-api',
	templateUrl: './mn-speech-api.component.html',
	styleUrls: ['./mn-speech-api.component.scss']
})
export class MnSpeechApiComponent implements OnInit {
	flashMessage: { content: String, type: String};
	responseWAV: String = '';
	authToken: String = '';
	constructor(private http: Http) {}

	ngOnInit() {
		this.flashMessage = {
			content: '',
			type: ''
		};
		this.loadToken();
	}
	sendToTTS(token, voice, text) {
		let request = {
			url: 'https://enkhsanaa.me/tts/',
			token: token.value,
			data: { txt: text.value, voice: voice.value}
		};
		let headers = new Headers();
		headers.append('Authorization', 'JWT ' + request.token);
		headers.append('Content-Type', 'application/json');
		let reader = new FileReader();
		reader.onload = function(e) {
			window.open(decodeURIComponent(reader.result), '_self', '', false);
		};
		this.http.post(request.url, request.data, { headers: headers }).map((data: any) => data.json())
			.subscribe((data: any) => {
			if (!data.success) {
				this.responseWAV = 'Алдаа!';
				return;
			}
			else this.responseWAV = data.fileName;
		});
	}
	sendToSTT() {}
	getToken(fname, lname, phone, email, username, password, aboutProject) {
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
				console.log(data);
				if (!data.success) {
					this.flashMessage.content = data.message;
					this.flashMessage.type = 'danger';
					setTimeout(() => {
						this.flashMessage.content = '';
					}, 2000);
					return;
				}
				this.flashMessage.content = 'Бүртгэл амжилттай! Таны токен ' + data.token;
				this.flashMessage.type = 'success';
				this.storeUserData(data.token);
			});
	}
	loadToken() {
		const token = localStorage.getItem('mnSpeechAPIToken') || '';
		this.authToken = token;
	}
	storeUserData(token) {
		localStorage.setItem('mnSpeechAPIToken', token);
		this.authToken = token;
	}
}
