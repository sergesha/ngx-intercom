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

  push(key: string | number, value: any, force: boolean = false) {
    const duplicate = this.data.get(key) === value;
    if (!duplicate) {
      this.data.set(key, value);
    }
    if (force || !duplicate) {
      this.subject.next(this.intercomData(key));
    }
  }

  read(keys?: string | number | Array<string | number>): Observable<IntercomData> {
    const initData: Array<IntercomData> = [];

    if (typeof keys !== 'undefined') {
      if (!Array.isArray(keys)) {
        keys = [keys];
      }

      keys.forEach(key => {
        if (this.data.has(key)) {
          initData.push(this.intercomData(key));
        }
      });
    }

    return this.subject.asObservable().pipe(
      startWith(...initData),
      filter(data => {
        return data && typeof data.name !== 'undefined' &&
          (typeof keys === 'undefined' || (<Array<string | number>>keys).includes(data.name));
      })
    );
  }

  last(key: string | number): any {
    return this.data.get(key);
  }

  remove(key: string | number): boolean {
    const success = this.data.delete(key);
    if (success) {
      this.subject.next(this.intercomData(key));
    }
    return success;
  }

  private intercomData(key: string | number): IntercomData {
    return {
      name: key,
      content: this.data.get(key)
    };
  }
}
