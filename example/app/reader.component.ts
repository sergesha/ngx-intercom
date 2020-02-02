import { Component, OnDestroy, OnInit } from '@angular/core';
import { IntercomService } from 'ngx-intercom';
import { Observable, Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-reader',
    templateUrl: './reader.component.html',
    styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit, OnDestroy {
    something: any;
    message: any;
    testMessage$: Observable<string>;
    private onDestroy$: Subject<void> = new Subject();

    constructor(private intercom: IntercomService) {
        this.intercom
            .read(['something', 'and-other-messages'])
            .pipe(
                takeUntil(this.onDestroy$),
            )
            // or .read ( 'something' ) - if only one issue to be watched
            .subscribe(data => {
                if (data['something']) {
                    this.something = data['something'];
                }
                if (data['and-other-messages']) {
                    this.message = data['and-other-messages'];
                }
            });
    }

    onAnythingChange($event) {
        this.intercom.push('anything', $event.anything);
        console.log($event.anything);
    }

    ngOnInit() {
        this.testMessage$ = this.intercom.read<string>('testMessage').pipe(pluck('testMessage'));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }
}
