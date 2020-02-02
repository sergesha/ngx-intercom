import { ModuleWithProviders, NgModule } from '@angular/core';
import { IntercomOptions, IntercomService } from './intercom.service';

export { IntercomOptions, IntercomData, IntercomService } from './intercom.service';

@NgModule({
	providers: [],
})
export class IntercomModule {
	static forRoot(defaultOptions?: Partial<IntercomOptions>): ModuleWithProviders {
        Object.assign(IntercomService.defaultOptions, defaultOptions);

		return {
			ngModule: IntercomModule,
			providers: [IntercomService],
		};
	}
}
