import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

@inject(HttpClient, Router)
export class ArtistEdit {
	artist = {};
	genres = [
		'Anime',
		'Blues',
		'Comedy',
		'Country',
		'Dance',
		'Disney',
		'Folk',
		'Hard Rock',
		'Hip-Hip/Rap',
		'Metal',
		'Pop',
		'Reggae',
		'Rock',
		'World'
	];

	constructor(http, router) {
		this.http = http;
		this.router = router;
	}

	activate(params) {
		if(params.id) {
			this.http.fetch('artists/' + params.id).then(response => response.json()).then(artist => {
				this.artist = artist;
			}, () => {});
		}
	}

	convertImage() {
		return new Promise(resolve => {
			if(typeof this.artist.image !== 'object' || this.artist.image.length === 0) {
				delete this.artist.image;
				resolve();
			} else {
				this.artist.image[0].convertToBase64().then(data => {
					delete this.artist.image;
					this.artist.base64Image = data;
					resolve();
				});
			}
		});
	}

	create() {
		this.convertImage().then(() => {
			this.http.fetch('artists', {
				method: 'post',
				body: json(this.artist)
			}).then(() => {
				this.router.navigateToRoute('artists');
			});
		});
	}

	update() {
		this.convertImage().then(() => {
			this.http.fetch('artists/' + this.artist._id, {
				method: 'put',
				body: json(this.artist)
			}).then(() => {
				this.router.navigateToRoute('artists');
			});
		});
	}

	destroy() {
		this.http.fetch('artists/' + this.artist._id, {
			method: 'delete'
		}).then(() => {
			this.router.navigateToRoute('artists');
		});
	}
}
