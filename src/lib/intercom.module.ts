import { ModuleWithProviders, NgModule } from '@angular/core';
import { IntercomService } from './intercom.service';

export { IntercomData, IntercomService } from './intercom.service';

@NgModule( {
    providers: []
} )
export class IntercomModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IntercomModule,
            providers: [ IntercomService ]
        };
    }
}