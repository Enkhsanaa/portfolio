import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
	SERVER_URL: String = 'https://enkhsanaa.me/';
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
	private audioStream: any;

	constructor(private http: Http, public snackBar: MatSnackBar, private ref: ChangeDetectorRef) {}

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
			url: this.SERVER_URL + 'tts/',
			token: 'JWT ' + token.value,
			data: { txt: text.value, voice: voice.value }
		};
		if (this.authToken == '') this.storeUserToken(token.value);
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
			}, (err) => {
				this.showLoadingBar = false;
				if (err.status == 401) {
					this.showSnackbar(false, 'Таны токен алдаатай байна.');
					this.clearUserTokenData();
				}
				else {
					let res = JSON.parse(err._body);
					this.showSnackbar(res.success, res.message);
				}
			});
	}
	startRecording() {
		const onSuccess = stream => {
			this.audioStream = stream;
			this.mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 16000 });
			this.mediaRecorder.ondataavailable = e => {
				this.chunks.push(e.data)
				const audio = this.microphone.nativeElement;
				const blob = new Blob(this.chunks, { type: 'audio/wav' });
				audio.src = window.URL.createObjectURL(blob);
				audio.load();
				this.audioStream.getTracks()[0].stop();
			};
			this.mediaRecorder.onstart = e => {
				this.isRecording = true;
				this.chunks.length = 0;
				this.ref.detectChanges();
			};
			this.mediaRecorder.start();
		}

		navigator.getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia;

		navigator.getUserMedia({ audio: true }, onSuccess, e => console.log(e));
	}
	stopRecording() {
		this.isRecording = false;
		this.ref.detectChanges();
		this.mediaRecorder.stop();
	}
	sendToSTT(token) {
		if (this.isRecording) this.stopRecording();
		this.showLoadingBar = true;
		const blob = new Blob(this.chunks, { type: 'audio/wav' });
		const audio = this.microphone.nativeElement;

		const formData = new FormData();
		formData.append('file', blob, "name.wav");
		formData.append('length', audio.duration);

		let request = {
			url: this.SERVER_URL + 'stt/',
			token: 'JWT ' + token.value,
			data: formData
		};
		if (this.authToken == '') this.storeUserToken(token.value);
		var headers = new Headers();
		headers.append('Authorization', request.token);

		this.http
			.post(request.url, request.data, { headers: headers })
			.map((data: any) => data.json())
			.subscribe((data: any) => {
				this.showLoadingBar = false;
				this.showSnackbar(data.success, data.success ? '' : data.message);
				if (data.success) this.responseText = data.message;
			}, (err) => {
				this.showLoadingBar = false;
				if (err.status == 401) {
					this.showSnackbar(false, 'Таны токен алдаатай байна.');
					this.clearUserTokenData();
				}
				else {
					let res = JSON.parse(err._body);
					this.showSnackbar(res.success, res.message);
				}
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
			.post(this.SERVER_URL + 'user/forgotToken', data, { headers: headers })
			.map((data: any) => data.json())
			.subscribe((data: any) => {
				this.showLoadingBar = false;
				this.showSnackbar(
					data.success,
					''
				);
				this.storeUserToken(data.token);
				this.speechApiStep = 2;
			}, (err) => {
				this.showLoadingBar = false;
				if (err.status == 401) {
					this.showSnackbar(false, 'Таны токен алдаатай байна.');
					this.clearUserTokenData();
				}
				else {
					let res = JSON.parse(err._body);
					this.showSnackbar(res.success, res.message);
				}
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
			.post(this.SERVER_URL + 'user', data, { headers: headers })
			.map((data: any) => data.json())
			.subscribe((data: any) => {
				this.showLoadingBar = false;
				this.showSnackbar(
					data.success,
					data.message
				);

			}, (err) => {
				this.showLoadingBar = false;
				if (err.status == 401) {
					this.showSnackbar(false, 'Таны токен алдаатай байна.');
					this.clearUserTokenData();
				}
				else {
					let res = JSON.parse(err._body);
					this.showSnackbar(res.success, res.message);
				}
			});
	}
	loadToken() {
		const token = localStorage.getItem('mnSpeechAPIToken') || '';
		this.authToken = token;
		if (token != '') this.speechApiStep = 2;
	}
	storeUserToken(token) {
		localStorage.setItem('mnSpeechAPIToken', token);
		this.authToken = token;
	}
	clearUserTokenData() {
		this.authToken = '';
		localStorage.removeItem('mnSpeechAPIToken');
	}
	tabChanged = idx => {
		if (idx != this.speechApiStep) this.speechApiStep = Number(idx);
	};
	showSnackbar(success: boolean, message: String) {
		this.snackBar.open((success ? 'Амжилттай! ' : 'Алдаа! ') + message, null, {
			duration: 5000,
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
