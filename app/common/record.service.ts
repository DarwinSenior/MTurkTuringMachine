import { Injectable } from '@angular/core';
import { Status, Record } from './record.model';
import 'core-js';
import * as _ from 'lodash'
const URLSearchParams = require('url-search-params');

@Injectable()
export class RecordService {
    constructor() {
        let param = new URLSearchParams(window.location.search);
        let vid = <Array<string>>param.get('vid').split(',') || [];
        this.path = window.location.pathname + vid[0];
        this.framelist = _.map(vid.slice(1), parseInt);
        this.destination = 'https://workersandbox.mturk.com/mturk/externalSubmit';
        this.assignmentId = param.get('assignmentId');
    }

    private records = <{ number: Status }>{};
    path: string;
    destination: string;
    framelist: Array<number>;
    assignmentId: string;

    put(id: number, choice: string) {
        this.records[id] = <Status>choice;
    }

    remove(id: number) {
        delete this.records[id];
    }

    submit() {
        this._submit({
            'path': this.path,
            'destination': _.join(_.map(this.records, (value, key) => `${key},${value}`), '|'),
            'assignmentId': this.assignmentId,
        }, this.destination)
    }

    private _submit(pair: Object, destination: string) {
        let form = <HTMLFormElement>document.createElement('form');
        _.each(pair, (value, key) => {
            let input = <HTMLInputElement>document.createElement('input');
            input.type = 'text';
            input.value = value;
            input.name = key;
            form.appendChild(input);
        });
        let button = <HTMLInputElement>document.createElement('submit');
        button.type = 'submit';
        form.action = destination;
        document.body.appendChild(form);
        // console.log(pair);
        form.submit();
    }
}
