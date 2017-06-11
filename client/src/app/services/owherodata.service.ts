import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http } from '@angular/http';

export interface HeroSkill {
    name: String;
    isUltimateAbility: Boolean;
    iconUrl: String;
    description: String;
}

export interface HeroData {
    code: String;
    name: String;
    portraitUrl: String;
    description: String;
    role: Number;
    synergy: String[];
    counter: String[];
    skills: HeroSkill[];
}

export interface HeroRole {
    name: String;
    id: Number;
    iconUrl: String;
}

export interface OverwatchStaticData {
    roles: HeroRole[];
    heroes: HeroData[];
}

@Injectable()
export class OverwatchHeroDataService {
    private _data$ = new ReplaySubject<OverwatchStaticData>();
    data$ = this._data$.asObservable();

    constructor(private http: Http) {}

    load() {
        this.http.get('/lib/overwatch.json')
            .map(res => res.json())
            .subscribe(this._data$);
    }
}
