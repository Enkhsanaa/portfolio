import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
	selector: 'app-mn-speech-api',
	templateUrl: './mn-speech-api.component.html',
	styleUrls: ['./mn-speech-api.component.scss']
})
export class MnSpeechApiComponent implements OnInit {
	message: String;
	constructor(private http: Http) {}

	ngOnInit() {}
	sendToTTS(token, text) {
		var request = {
			url: 'tts/',
			token: token,
			data: { txt: text }
		};
		var headers = new Headers();
		headers.append('Authorization', 'JWT ' + request.token);
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		var reader = new FileReader();
		reader.onload = function(e) {
			window.open(decodeURIComponent(reader.result), '_self', '', false);
		};
		this.http.post(request.url, request.data, { headers: headers }).subscribe(res => {
			console.log(res);
			if (res.status == 200) {
				reader.readAsDataURL(new Blob([res], { type: 'audio/wav' }));
			} else this.message = res.statusText;
		});
	}
	sendToSTT() {
		return '';
	}
}
