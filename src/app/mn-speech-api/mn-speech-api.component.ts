import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import {Buffer} from 'buffer';
import 'rxjs/Rx';
declare const navigator: any;
declare const MediaRecorder: any;

@Component({
	selector: 'app-mn-speech-api',
	templateUrl: './mn-speech-api.component.html',
	styleUrls: ['./mn-speech-api.component.scss']
})
export class MnSpeechApiComponent implements OnInit {
	flashMessage: { content: String; type: String };
	voices: Array<{ viewValue: String; value: String }> = [];
	responseWAV: String = '';
	responseText: String = '';
	authToken: String = '';
	speechApiStep: Number = 0;
	showLoadingBar: Boolean = false;
	@ViewChild('microphone') microphone: any;

	public isRecording: boolean = false;
	private chunks: any = [];
	private mediaRecorder: any;

	constructor(private http: Http, public snackBar: MatSnackBar) {
		const onSuccess = stream => {
			this.mediaRecorder = new MediaRecorder(stream);
			this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
		};

		navigator.getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia;

		navigator.getUserMedia({ audio: true }, onSuccess, e => console.log(e));
	}

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
			data: { txt: text.value, voice: voice.value }
		};
		let headers = new Headers();
		headers.append('Authorization', request.token);
		headers.append('Content-Type', 'application/json');
		let reader = new FileReader();
		reader.onload = function(e) {
			window.open(decodeURIComponent(reader.result), '_self', '', false);
		};
		this.http
			.post(request.url, request.data, { headers: headers })
			.map((data: any) => data.json())
			.subscribe((data: any) => {
				this.showLoadingBar = false;
				this.showSnackbar(
					data.success,
					data.success
						? 'Татаж авмагц хөрвүүлсэн файл сэрвэр дээрээс устах болно.'
						: data.message
				);
				if (data.success) this.responseWAV = data.fileName;
			});
	}
	startRecording() {
		this.isRecording = true;
		this.mediaRecorder.start();
	}
	stopRecording() {
		this.isRecording = false;
		this.mediaRecorder.stop();
	}
	sendToSTT(token) {
		const audio = this.microphone.nativeElement;
		const blob = new Blob(this.chunks, { type: 'audio/wav' });
		// this.chunks.length = 0;
		audio.src = window.URL.createObjectURL(blob);

		var reader = new FileReader();
		var onLoadEnd = (function(e) {
			reader.removeEventListener('loadend', onLoadEnd, false);
			if (e.error) console.log(e.error);
			else this.sendWAV(token, Buffer.from(reader.result));
		}).bind(this);

		reader.addEventListener('loadend', onLoadEnd, false);
		reader.readAsArrayBuffer(blob);

		audio.load();

		
	}
	sendWAV(token, data) {
		let request = {
			url: 'https://enkhsanaa.me/stt/',
			token: token.value,
			data: data
		};
		var headers = new Headers();
		headers.append('Authorization', request.token);
		headers.append('Content-Type', 'x-www-form-urlencoded');

		this.http
			.post(request.url, request.data, { headers: headers })
			.map((data: any) => data.json())
			.subscribe((data: any) => {
				this.showLoadingBar = false;
				this.showSnackbar(data.success, data.success ? '' : data.message);
				if (data.success) this.responseText = data.text;
			});
	}
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
				this.showSnackbar(
					data.success,
					data.success
						? 'Та одоо токен оо ашиглан манай API-г ашиглах боломжтой.'
						: data.message
				);
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
				this.showSnackbar(
					data.success,
					data.success
						? 'Та одоо токен оо ашиглан манай API-г ашиглах боломжтой.'
						: data.message
				);
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
	tabChanged = idx => {
		if (idx != this.speechApiStep) this.speechApiStep = Number(idx);
	};
	showSnackbar(success: boolean, message: String) {
		this.snackBar.open((success ? 'Амжилттай! ' : 'Алдаа! ') + message, null, {
			duration: 20000,
			verticalPosition: 'top',
			extraClasses: [
				'mt-3',
				'alert',
				'alert-' + (success ? 'success' : 'danger'),
				'text-center'
			]
		});
	}
}
