import { Component, OnDestroy, OnInit } from '@angular/core';
import * as showdown from 'showdown';

const converter = new showdown.Converter();

@Component({
    selector: 'help-page',
    template: converter.makeHtml(require('./help.component.md')),
    styles: [require('./help.component.css')]
})
export class HelpComponent{
}
