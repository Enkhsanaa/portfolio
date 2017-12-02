import { Component } from '@angular/core';
import {
	trigger,
	animate,
	style,
	group,
	animateChild,
	query,
	stagger,
	transition
} from '@angular/animations';

const routerAnimations = [
	trigger('routerTransition', [
		transition('* <=> *', [
			query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
			group([
				query(
					':enter',
					[
						style({ transform: 'scale3d(0.5, 0.5, 0.5)', opacity: 0 }),
						animate('0.9s ease-in-out', style({ transform: 'scale3d(1, 1, 1)', opacity: 1, position: 'relative' }))
					],
					{ optional: true }
				),
				query(
					':leave',
					[
						style({ transform: 'scale3d(1, 1, 1)', opacity: 1 }),
						animate('0.9s ease-in-out', style({ transform: 'scale3d(1.5, 1.5, 1.5)', opacity: 0 }))
					],
					{ optional: true }
				)
			])
		])
	])
];

@Component({
	selector: 'app-root',
	animations: routerAnimations,
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'app';
	getState(outlet) {
		return outlet.activatedRouteData.state;
	}
}
