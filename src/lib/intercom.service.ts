import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';

export interface IntercomData {
  name: string | number;
  content: any | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class IntercomService {

  private subject: Subject<IntercomData> = new Subject();
  private data: Map<string | number, any> = new Map();

  constructor() {
  }

  push(channel: string | number, value: any, force: boolean = false) {
    const duplicate = this.data.get(channel) === value;
    if (!duplicate) {
      this.data.set(channel, value);
    }
    if (force || !duplicate) {
      this.subject.next(this.intercomData(channel));
    }
  }

  read(channels?: string | number | Array<string | number>): Observable<IntercomData> {
    const initData: Array<IntercomData> = [];

    if (typeof channels !== 'undefined') {
      if (!Array.isArray(channels)) {
        channels = [channels];
      }

      channels.forEach(key => {
        if (this.data.has(key)) {
          initData.push(this.intercomData(key));
        }
      });
    }

    return this.subject.asObservable().pipe(
      startWith(...initData),
      filter(data => {
        return data && typeof data.name !== 'undefined' &&
          (typeof channels === 'undefined' || (<Array<string | number>>channels).includes(data.name));
      })
    );
  }

  last(channel: string | number): any {
    return this.data.get(channel);
  }

  remove(channel: string | number): boolean {
    const success = this.data.delete(channel);
    if (success) {
      this.subject.next(this.intercomData(channel));
    }
    return success;
  }

  private intercomData(channel: string | number): IntercomData {
    return {
      name: channel,
      content: this.data.get(channel)
    };
  }
}
