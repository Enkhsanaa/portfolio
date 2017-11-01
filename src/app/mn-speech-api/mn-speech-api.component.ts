import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
	selector: 'app-mn-speech-api',
	templateUrl: './mn-speech-api.component.html',
	styleUrls: ['./mn-speech-api.component.scss']
})
export class MnSpeechApiComponent implements OnInit {
	message: String;
	mToken: String;
	constructor(private http: Http) {}

	ngOnInit() {}
	sendToTTS(token, text) {
		let request = {
			url: 'tts/',
			token: token,
			data: 'txt=' + text
		};
		let headers = new Headers();
		headers.append('Authorization', 'JWT ' + request.token);
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let reader = new FileReader();
		reader.onload = function(e) {
			window.open(decodeURIComponent(reader.result), '_self', '', false);
		};
		this.http.post(request.url, request.data, { headers: headers }).subscribe(res => {
			reader.readAsDataURL(new Blob([res], { type: 'audio/wav' }));
		});
	}
	sendToSTT() {}
	getToken(fname, lname, phone, email, username, password, aboutProject) {
		let data = 'fname=' + fname + 'lname=' + lname;
		data += 'phone=' + phone + 'email=' + email;
		data += 'username=' + username + 'password=' + password;
		data += 'aboutProject=' + aboutProject;

		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		this.http.post('user', data, { headers: headers }).subscribe(res => {
			var resp = JSON.parse(res.text());
			if (!resp.success) {
				this.mToken = resp.message;
			} else this.mToken = resp.token;
		});
	}
}
