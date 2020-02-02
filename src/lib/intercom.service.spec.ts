import { inject, TestBed } from '@angular/core/testing';
import { skip, take } from 'rxjs/operators';

import { IntercomModule } from './intercom.module';
import { IntercomService } from './intercom.service';

describe("IntercomService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [IntercomModule.forRoot()],
        });
    });

    it("should be created", inject(
        [IntercomService],
        (service: IntercomService) => {
            expect(service).toBeTruthy();
        },
    ));

    it("should get content equal to afterward pushed value", inject(
        [IntercomService],
        (service: IntercomService) => {
            service.read(['test']).subscribe(data => {
                expect(data).toEqual({ test: 'The Test After' });
            });
            service.push('test', 'The Test After');
        },
    ));

    it("should read multiple values and get values pushed before", inject(
        [IntercomService],
        (service: IntercomService) => {
            service.push('1', 'The Test 1');
            service.push('2', 'The Test 2');

            service
                .read(['1', '2'])
                .pipe(skip(1))
                .subscribe(data => {
                    expect(data).toEqual({ '2': 'The Test 2' });
                });
        },
    ));

    it("should remove content and get 'null' value", inject(
        [IntercomService],
        (service: IntercomService) => {
            service.push('test', 'The Test Value');
            service
                .read('test')
                .pipe(skip(1))
                .subscribe(data => {
                    expect(data).toEqual({ 'test': null });
                });
            service.remove('test');
        },
    ));

    it("should not send duplicate values if it's not intended", inject(
        [IntercomService],
        (service: IntercomService) => {
            service
                .read(['test'])
                .pipe(
                    take(5),
                    skip(4),
                )
                .subscribe(data => {
                    expect(data).toEqual({ 'test': 'The Test Last' });
                });
            service.push('test', 'The Test First');
            service.push('test', 'The Test Duplicate True');
            service.push('test', 'The Test Duplicate True');
            service.push('test', 'The Test Duplicate False');
            service.push('test', 'The Test Duplicate False');
            service.push('test', 'The Test Last');
        },
    ));

    it("should get current (last) value", inject(
        [IntercomService],
        (service: IntercomService) => {
            service.push('test', 'The Prev Value');
            service.push('test', 'The Last Value');
            expect(service.last('test')).toEqual('The Last Value');
        },
    ));
});
