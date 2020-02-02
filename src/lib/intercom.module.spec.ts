import { async, TestBed } from '@angular/core/testing';
import { IntercomModule } from './intercom.module';

describe('NgxIntercomModule', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [IntercomModule],
		}).compileComponents();
	}));

	it('should create', () => {
		expect(IntercomModule).toBeDefined();
	});
});
