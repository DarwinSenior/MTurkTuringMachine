import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecordService } from './common/record.service'

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')],
    providers: [RecordService],
})
export class AppComponent implements OnDestroy, OnInit {
    sub: any;
    path: string = 'helloworld';

    constructor(private recorder: RecordService) {
    }

    ngOnInit() {
    }
    ngOnDestroy() {
    }
}
