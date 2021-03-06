import { Component, NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { TestBed, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';

import { advance, createRoot } from '../test.mocks';

import { Angulartics2 } from './angulartics2';
import { Angulartics2On } from './angulartics2On';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

@Component({
  selector: 'root-comp',
  template: `<a [angulartics2On]="'click'" [angularticsEvent]="'InitiateSearch'"></a>`
})
class RootCmp {
  name: string;
}

@Component({
  selector: 'root-comp',
  template: `
    <button (click)="triggerEvent($event)">Greet</button>
    <a angulartics2On (customEvent)="eventTrack($event)" [angularticsEvent]="'InitiateSearch'"></a>
  `
})
class RootCmp1 {
  name: string;
}

@Component({
  selector: 'root-comp',
  template: `<div [angulartics2On]="'click'" [angularticsEvent]="'InitiateSearch'" [angularticsCategory]="'Search'"></div>`
})

class RootCmp2 {
  name: string;
}

@Component({
  selector: 'root-comp',
  template: `<a [angulartics2On]="'click'" [angularticsCategory]="'Search'">InitiateSearch</a>`
})
class RootCmp3 {
  name: string;
}

@NgModule({
  imports: [CommonModule],
  entryComponents: [
    RootCmp,
    RootCmp1,
    RootCmp2,
    RootCmp3
  ],

  exports: [
    RootCmp,
    RootCmp1,
    RootCmp2,
    RootCmp3
  ],

  declarations: [
    RootCmp,
    RootCmp1,
    RootCmp2,
    RootCmp3,
    Angulartics2On
  ]
})
export class TestModule {
}

export function main() {

  describe('angulartics2On', () => {

    var fixture: ComponentFixture<any>;
    var compiled: any;
    var EventSpy: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          TestModule
        ],
        providers: [
          { provide: Location, useClass: SpyLocation },
          Angulartics2
        ]
      });

      EventSpy = jasmine.createSpy('EventSpy');
    });

    it('should subscribe to element events',
      fakeAsync(inject([Angulartics2],
        (angulartics2: Angulartics2) => {
          fixture = createRoot(RootCmp);
          expect(EventSpy).not.toHaveBeenCalled();
          angulartics2.eventTrack.subscribe((x: any) => EventSpy(x));
          compiled = fixture.debugElement.nativeElement.children[0];
          compiled.click();
          advance(fixture);
          expect(EventSpy).toHaveBeenCalledWith({ action: 'InitiateSearch', properties: { eventType: 'click' } });
        })));

    // WIP: trying to implement a way to subscribe to custom event types
    xit('should subscribe to custom eventemiter',
      fakeAsync(inject([Angulartics2],
        (angulartics2: Angulartics2) => {
          fixture = createRoot(RootCmp1);
          expect(EventSpy).not.toHaveBeenCalled();
          angulartics2.eventTrack.subscribe((x: any) => EventSpy(x));
          compiled = fixture.debugElement.nativeElement.children[0];
          compiled.click();
          advance(fixture);
          expect(EventSpy).toHaveBeenCalledWith({ action: 'InitiateSearch', properties: { eventType: undefined } });
        })));

    it('should not send on and event fields to the eventTrack function',
      fakeAsync(inject([Angulartics2],
        (angulartics2: Angulartics2) => {
          fixture = createRoot(RootCmp2);
          expect(EventSpy).not.toHaveBeenCalled();
          angulartics2.eventTrack.subscribe((x: any) => EventSpy(x));
          compiled = fixture.debugElement.nativeElement.children[0];
          compiled.click();
          advance(fixture);
          expect(EventSpy).toHaveBeenCalledWith({ action: 'InitiateSearch', properties: { category: 'Search', eventType: 'click' } });
        })));

    // Need refactor or maybe just remove functionality as it might break in other platforms other than web browsers.
    xit('should infer event',
      fakeAsync(inject([Angulartics2],
        (angulartics2: Angulartics2) => {
          fixture = createRoot(RootCmp3);
          expect(EventSpy).not.toHaveBeenCalled();
          angulartics2.eventTrack.subscribe((x: any) => EventSpy(x));
          compiled = fixture.debugElement.nativeElement.children[0];
          compiled.click();
          advance(fixture);
          expect(EventSpy).toHaveBeenCalledWith({ action: 'InitiateSearch', properties: { category: 'Search', eventType: 'click' } });
        })));

  });
}
