import { ModuleWithProviders, NgModule } from '@angular/core';

import { INTERCOM_SERVICE_DEFAULT_OPTIONS_TOKEN, IntercomOptions, IntercomService } from './intercom.service';

export { IntercomOptions, IntercomData, IntercomService } from './intercom.service';


@NgModule({
	providers: [],
})
export class IntercomModule {
	static forRoot(defaultOptions?: Partial<IntercomOptions>): ModuleWithProviders<IntercomModule> {
		return {
			ngModule: IntercomModule,
			providers: [
			    IntercomService,
                { provide: INTERCOM_SERVICE_DEFAULT_OPTIONS_TOKEN, useValue: defaultOptions },
            ],
		};
	}
}
