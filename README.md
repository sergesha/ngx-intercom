# ngx-intercom

Intercom Service provides internal communication between app components

You can call it and use as "simplest state management",
then there is no need to use NgRx / Akita / etc.
or implement your own RxJs service for that.
Because it's already done for you!

[![npm version](https://badge.fury.io/js/ngx-intercom.svg)](https://badge.fury.io/js/ngx-intercom)
[![](https://data.jsdelivr.com/v1/package/npm/ngx-intercom/badge)](https://www.jsdelivr.com/package/npm/ngx-intercom)

## Install

`npm i ngx-intercom --save`

### Import the service to your project and use it in your Component pushing new 'message' of any type intended for others components to be aware of it and reading it whenever the 'message' change in any components
Using of localStorage can be configured also to permanently save data.


```typescript
import { IntercomModule } from 'ngx-intercom';

// in app.module.ts
@NgModule( {
  imports: [
    ...
    IntercomModule.forRoot({
        useLocalStorage: true, // optional, false by default
        forceUpdate: false,    // optional, false by default
    })
    ...
  ]
} )
export class AppModule { ... }

// in your first component
import { IntercomService } from 'ngx-intercom';

@Component( {
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
} )
class HomeComponent implements OnInit {
  testMessage;

  constructor(private intercom: IntercomService){}

  ngOnInit() {
    let counter = 1;
    setInterval(() => {
      this.testMessage = `Test Message-${counter++}`;
      this.intercom.push('testMessage', this.testMessage);
      console.log(this.testMessage);
    }, 1000);

    this.intercom.push('something', 'something');

    setTimeout(() => {
       this.intercom.push('and-other-messages', 'and-other-messages');
    }, 3000);
  }

  onSomethingChange($event)
  {
    this.intercom.push('something', $event.something);
    console.log( $event.something )
  }

}

// in your other component
import { IntercomService } from 'ngx-intercom';
import { Subscription } from 'rxjs';

@Component( {
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: [ './other.component.scss' ]
} )
class OtherComponent implements OnInit, OnDestroy {
  something: any;
  message: any;
  testMessage$: Observable<string>;

  private onDestroy$: Subject<void> = new Subject();

  constructor(private intercom: IntercomService){
  }

  ngOnInit() {
    // It's preferable!
    // then in .html read this way:
    // <div> {{ testMessage$ | async }} </div>
    //
    this.testMessage$ = this.intercom.read<string>('testMessage').pipe(
        pluck('testMessage'),
    );

    // ... and this way also available
    //
    this.intercom
      .read( [ 'something', 'and-other-messages' ] )
      .pipe(
          takeUntil(this.onDestroy$),
      )
      // or .read ( 'something' ) - if only one issue to be watched
      .subscribe( data => {
          if (data['something']) {
              this.something = data['something'];
          }
          if (data['and-other-messages']) {
              this.message = data['and-other-messages'];
          }
      });

  }

  onAnythingChange($event)
  {
    this.intercom.push('anything', $event.anything);
    console.log($event.anything)
  }

  ngOnDestroy(){
    this.onDestroy$.next();
  }
}
```

### Interfaces

```typescript
export interface IntercomData<T = any> {
    [key: string]: T;
}
```

### Methods

```typescript
/**
 * Push the new message / state (channel : value), 
 *  if useLocalStorage === true - localStorage will be used to store data (false by default)
 *  if forceUpdate === true - will be forcebly repeated even it's duplicate (false by default)
 */
push<T>( channel: string, value: T, useLocalStorage: boolean = false, forceUpdate: boolean = false ): void

/**
 * Read the stream of messages / state changes (channel : value), if channels are empty - read all the messages / state changes, otherwise - only specified
 */
read<T>( channels?: string | Array<string> ): Observable<IntercomData<T>>

/**
 * Read the last value of message / state by channel specified
 */
last<T>( channel: string ): T

/**
 * Remove the message / state by channel specified
 */
remove( channel: string ): boolean

```

### Contribute

Any pull-request is more than welcome :boom: :smile:

This project adheres to the Contributor Covenant [code of conduct](http://contributor-covenant.org/). By participating, you are expected to uphold this code.

### License

MIT
