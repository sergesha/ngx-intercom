import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IntercomModule } from "ngx-intercom";

import { AppComponent } from "./app.component";
import { ReaderComponent } from "./reader.component";
import { SourceComponent } from "./source.component";

@NgModule({
  declarations: [AppComponent, SourceComponent, ReaderComponent],
  imports: [
      BrowserModule,
      IntercomModule.forRoot({
          useLocalStorage: true,
      })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
