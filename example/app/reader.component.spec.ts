import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IntercomModule } from 'ngx-intercom';

import { ReaderComponent } from './reader.component';

describe('ReaderComponent', () => {
	let component: ReaderComponent;
	let fixture: ComponentFixture<ReaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ReaderComponent],
			imports: [IntercomModule.forRoot()],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
