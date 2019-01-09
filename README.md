# ngx-intercom
Intercom Service provides internal communication between app components

[![npm version](https://badge.fury.io/js/ngx-intercom.svg)](https://badge.fury.io/js/ngx-intercom)

## Install

`npm i ngx-intercom --save`

### Import the service to your project and use it in your Component pushing new 'message' of any type intended for others components to be aware of it and reading it whenever the 'message' change in any components

```typescript
import { IntercomModule } from 'ngx-intercom';

// in app.module.ts
@NgModule( {
  imports: [
    ...
    IntercomModule.forRoot()
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
  constructor(private intercom: IntercomService){}

  onSomethingChange($event)
  {
    this.intercom.push ('something', $event.something);
    console.log( $event.something )
  }

  ngOnInit(){}
}

// in your other component
import { IntercomService } from 'ngx-intercom';
import { Subscription } from 'rxjs/Subscription';
                                                 	
@Component( {
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: [ './other.component.scss' ]
} )
class OtherComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private intercom: IntercomService){

      subscription = this.intercom
        .read( [ 'something', 'and-other-messages' ] )
	// or .read ( 'something' ) - if only one issue to be watched
        .subscribe( data => {
          switch (data.name) {
            case 'something':
              this.something = data.content || '';
              break;
            case 'and-other-messages':
              this.message = data.content || '';
              break;
          }
        } );

  }

  onAnythingChange($event)
  {
    this.intercom.push ('anything', $event.anything);
    console.log( $event.anything )
  }

  ngOnInit(){}

  ngOnDestroy(){
    subscription.unsubscribe();
  }
}
```
### Methods

```typescript
/**
 * Push the new message (key : value), if force === true - will be forcebly repeated even it's duplicate
 */
push( key: string | number, value: any, force: boolean = false )

/**
 * Read the stream of messages (key : value), if keys are empty - read all the messages, otherwise - only specified
 */
read( keys?: string | number | Array<string | number> ): Observable<IntercomData>

/**
 * Read the last value of message by key specified
 */
last( key: string | number ): any

/**
 * Remove the message by key specified
 */
remove( key: string | number ): boolean

```
### Contribute

Any pull-request is more than welcome :boom: :smile:

This project adheres to the Contributor Covenant [code of conduct](http://contributor-covenant.org/). By participating, you are expected to uphold this code.

### License

MIT
