import "../scss/app.scss";
import Init from "./init.js";

import AppUtils from '../../../src/lib/js/app/shared/appUtils.js';
import {
	GetLocalStoreDB,
} from '../../../src/lib/js/app/shared/localCache/index.js';

const ID_DEMOAPP = '#demo-app';

export default class DemoApp {
	constructor() {
		this.$ids = {
			container: `app-${AppUtils.randomHexstring()}`,
		};

		const view = `<div id="${this.ids.container}"></div>`;

		const viewa = $('<div/>')
			.attr('id', this.ids.container);
		
	}

	get ids() {
		return this.$ids;
	}

	appendTo(parent) {
		parent[0].innerHTML = this.view;
	}

	async show() {
		this.hide();
		await this.openIndexedDB();/* 
		console.log('FSLOG app show', this.signInFlow)
		return this.signInFlow.show(); */
	}

	async hide() {
		return this.closeIndexedDB();
	}

	async openIndexedDB() {
		const db = GetLocalStoreDB();
		console.log('FSLOG', db)
		return db.open()
			.catch((e) =>
				console.error(e));
	}

	async closeIndexedDB() {
		const db = GetLocalStoreDB();

		return db.close()
			.catch((e) =>
				console.error(e));
	}
}
document.addEventListener('DOMContentLoaded', async () => {

	
	Init.auth.connect();

	window.onpopstate = (event) => {
		console.log(
			'FSLOG popstate',
			'popstate',
			'hash',
			event.currentTarget.location.hash
		);
		location.reload();
	  };

	/* const demoApp = new DemoApp();
	console.log('FSLOG doc ready', ID_DEMOAPP, demoApp)
	//demoApp.appendTo(document.querySelector(ID_DEMOAPP));
	document.querySelector(ID_DEMOAPP).innerHTML = demoApp.$view;
	await demoApp.show(demoApp.$ids);

	window.addEventListener('unload', async () => {
		console.log(
			'unload',
			'demoApp.hide'
		);
		await demoApp.hide();
	}); */

	/* $(window).on('popstate', async (e) => {
		console.log(
			'popstate',
			'hash',
			e.currentTarget.location.hash
		);
		location.reload();
	}); */
});
