import { Component, OnInit } from '@angular/core';
import { IntercomService } from 'ngx-intercom';

@Component({
	selector: 'app-source',
	templateUrl: './source.component.html',
	styleUrls: ['./source.component.scss'],
})
export class SourceComponent implements OnInit {
	testMessage;

	constructor(private intercom: IntercomService) {
	}

	ngOnInit() {
		let counter = 1;
		setInterval(() => {
			this.testMessage = `Test Message-${counter++}`;
			this.intercom.push('testMessage', this.testMessage);
		}, 1000);

		this.intercom.push('something', 'something');

        setTimeout(() => {
            this.intercom.push('and-other-messages', 'and-other-messages');
        }, 3000);	}
}
