import { TestBed, async } from '@angular/core/testing';
import { IntercomModule } from 'ngx-intercom';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReaderComponent } from './reader.component';
import { SourceComponent } from './source.component';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, IntercomModule.forRoot()],
			declarations: [AppComponent, SourceComponent, ReaderComponent],
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have as title 'demo-intercom'`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('demo-intercom');
	});

	it('should render title in a h1 tag', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('h1').textContent).toContain(
			'Welcome to demo-intercom!',
		);
	});
});
