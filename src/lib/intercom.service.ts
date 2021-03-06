import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { filter, shareReplay, startWith, takeUntil } from 'rxjs/operators';

export const INTERCOM_SERVICE_DEFAULT_OPTIONS_TOKEN: InjectionToken<Partial<IntercomOptions>> = new InjectionToken(
    'Ngx-Intercom Service Default Options'
);

export interface IntercomOptions {
    useLocalStorage: boolean,
    forceUpdate: boolean
}

export interface IntercomData<T = any> {
    [key: string]: T;
}

export const STORAGE_EVENT_TYPE = 'storage';

@Injectable({
    providedIn: 'root',
})
export class IntercomService implements OnDestroy {
    private readonly defaultOptions: IntercomOptions = {
        useLocalStorage: false,
        forceUpdate: false,
    };
    // tslint:disable-next-line:no-any
    private readonly memorizedData: Map<string, any> = new Map();
    private readonly onUpdate$: Subject<IntercomData> = new Subject();
    private readonly onDestroy$: Subject<void> = new Subject();
    private readonly subscriptions: Map<string, Observable<IntercomData>> = new Map();

    constructor(@Inject(INTERCOM_SERVICE_DEFAULT_OPTIONS_TOKEN) defaultOptions: Partial<IntercomOptions>) {
        Object.assign(this.defaultOptions, defaultOptions);
        this.startStorageEventListener();
    }

    private static setDataToLocalStorage<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    }

    private static getDataFromLocalStorage<T>(key: string): T {
        try {
            const value: string = localStorage.getItem(key);

            return value === null || value === undefined
                ? null
                : JSON.parse(value);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    private static coerceReturnType<T>(value: T): T {
        switch (typeof value) {
            case 'string': {
                return String(value).valueOf() as unknown as T;
            }
            case 'number': {
                return Number(value).valueOf() as unknown as T;
            }
            case 'boolean': {
                return !!value as unknown as T;
            }
            default: {
                return value;
            }
        }
    }

    ngOnDestroy(): void {
        this.stopStorageEventListener();
        this.onUpdate$.complete();
        this.onDestroy$.next();
    }

    private startStorageEventListener(): void {
        window.addEventListener(STORAGE_EVENT_TYPE, this.storageEventListener.bind(this));
    }

    private stopStorageEventListener(): void {
        window.removeEventListener(STORAGE_EVENT_TYPE, this.storageEventListener.bind(this));
    }

    private storageEventListener(event: StorageEvent): void {
        if (event.storageArea === localStorage) {
            this.memorizedData.set(event.key, event.newValue);
            this.onUpdate$.next({ [event.key]: event.newValue });
        }
    }

    private getMemorizedData<T>(key: string): IntercomData<T> {
        const memorizedData: IntercomData<T> = { [key]: null };

        if (this.memorizedData.has(key)) {
            memorizedData[key] = this.memorizedData.get(key);
        } else {
            const persistentData: T = IntercomService.getDataFromLocalStorage<T>(key);

            if (persistentData !== null && persistentData !== undefined) {
                this.memorizedData.set(key, persistentData);
                memorizedData[key] = persistentData;
            }
        }

        return memorizedData;

    }

    public push<T>(
        key: string,
        value: T,
        useLocalStorage: boolean = this.defaultOptions.useLocalStorage,
        forceUpdate: boolean = this.defaultOptions.forceUpdate,
    ): void {
        const duplicate: boolean = this.memorizedData.get(key) === value;
        const typedValue: T = IntercomService.coerceReturnType<T>(value);

        if (!duplicate) {
            this.memorizedData.set(key, typedValue);

            if (useLocalStorage) {
                IntercomService.setDataToLocalStorage<T>(key, typedValue);
            }
        }

        if (forceUpdate || !duplicate) {
            this.onUpdate$.next(this.getMemorizedData<T>(key));
        }
    }

    public read<T>(keys?: string | Array<string>): Observable<IntercomData<T>> {
        let initData: IntercomData<T> = {};
        let subKey = '<_all_keys_>';

        if (typeof keys !== 'undefined') {
            if (!Array.isArray(keys)) {
                keys = [keys];
            }

            initData = keys.reduce((data: IntercomData<T>, key: string) => {
                return {
                    ...data,
                    [key]: this.last<T>(key),
                };
            }, initData);

            subKey = keys.reduce((name: string, key: string) => name ? `${ name }<+>${ key }` : key, '') as string;
        }

        if (!this.subscriptions.has(subKey)) {
            this.subscriptions.set(subKey, this.onUpdate$.asObservable().pipe(
                filter((change: IntercomData<T>) => {
                    return change &&
                        (typeof keys === 'undefined' || Object.keys(change).every((key: string) => keys.includes(key)));
                }),
                shareReplay({
                    bufferSize: 1,
                    refCount: true,
                }),
                takeUntil(this.onDestroy$),
            ));
        }

        return this.subscriptions.get(subKey).pipe(
            startWith(initData),
        );
    }

    public last<T>(key: string): T {
        const value: T = this.getMemorizedData<T>(key)[key];

        return IntercomService.coerceReturnType<T>(value);
    }

    public remove(key: string): boolean {
        localStorage.removeItem(key);
        this.memorizedData.delete(key);
        this.onUpdate$.next(this.getMemorizedData(key));

        return !this.memorizedData.has(key);
    }
}
