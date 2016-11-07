import { Component, ViewChild, AfterViewInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { ElementRef, HostListener } from '@angular/core';
import { Http } from "@angular/http"
import 'rxjs/add/operator/toPromise'

import * as _ from 'lodash';
import { create_image, BoundingBox, parseBox } from '../../common/util'

type ComponentState = [HTMLImageElement, HTMLImageElement, string];
@Component({
    selector: 'show-canvas',
    template: require('./canvas.component.html'),
    styles: [require('./canvas.component.css')]
})
export class CanvasComponent implements AfterViewInit, OnChanges {
    @Input() fid: number;
    @Input() path: string;
    @Input() model: string;
    canvasHeight: number = 0;
    canvasWidth: number = 0;


    @ViewChild("bounded") boundedRef;
    @ViewChild("filtered") filteredRef;

    @HostListener('window:resize', ['$event.target'])
    onResize() {
        const el = <HTMLElement>this.el.nativeElement;
        const host_width = el.getBoundingClientRect().width;
        this.canvasWidth = Math.max(300, host_width - 20);
        this.canvasHeight = this.canvasWidth / 3 * 2;
        setTimeout(() => this.updateCanvas(this._current_state), 0);
    }


    private _initresolved;
    initialized = new Promise((resolve, _) => this._initresolved = resolve);
    ngAfterViewInit() {
        this.bounded_ctx = this.boundedRef.nativeElement.getContext('2d');
        this.filtered_ctx = this.filteredRef.nativeElement.getContext('2d');
        setTimeout(this._initresolved, 200);
        setTimeout(this.onResize.bind(this), 0);
        setTimeout(this.onResize.bind(this), 20);
    }

    indicate() {
        this.filtered_ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.bounded_ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.filtered_ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.bounded_ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.updateState().then(this.updateCanvas.bind(this));
    }

    bounded_ctx: CanvasRenderingContext2D;
    filtered_ctx: CanvasRenderingContext2D;

    private _current_state = <ComponentState>[];

    updateCanvas(current_state?: ComponentState) {
        const [bg_img, msk_img, xml] = current_state || this._current_state;
        if (!(bg_img && msk_img && xml)) return;
        const parser = new DOMParser();
        const box = parseBox(parser.parseFromString(xml, 'text/xml'), this.canvasWidth, this.canvasHeight);

        this.filtered_ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.filtered_ctx.globalCompositeOperation = 'source-over';
        this.filtered_ctx.drawImage(msk_img, 0, 0, this.canvasWidth, this.canvasHeight);
        this.filtered_ctx.globalCompositeOperation = 'source-in';
        this.filtered_ctx.drawImage(bg_img, 0, 0, this.canvasWidth, this.canvasHeight);

        this.bounded_ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.bounded_ctx.drawImage(bg_img, 0, 0, this.canvasWidth, this.canvasHeight);

        this.bounded_ctx.globalAlpha = 0.3;
        this.bounded_ctx.drawImage(msk_img, 0, 0, this.canvasWidth, this.canvasHeight);
        this.bounded_ctx.globalAlpha = 1;

        this.bounded_ctx.lineWidth = 4;
        this.bounded_ctx.strokeRect(box.x, box.y, box.width, box.height);
        this.bounded_ctx.textAlign = 'center';
        this.bounded_ctx.textBaseline = 'top';
        this.bounded_ctx.font = '30px Arial';
        this.bounded_ctx.fillText(box.name, box.x + box.width / 2, box.y + box.height);
    }

    updateState() {
        const background_path = `${this.path}/frame/${_.padStart((this.fid + 1).toString(), 8, '0')}.jpg`;
        const mask_path = `${this.path}/probmaps/seg_${this.model}_${this.fid}.png`;
        const box_path = `${this.path}/bbox/${_.padStart(this.fid.toString(), 6, '0')}.xml`;
        return Promise.all([
            this.initialized,
            create_image(background_path),
            create_image(mask_path),
            this.http.get(box_path).toPromise()
        ]).then((values: any) => {
            this._current_state = [values[1], values[2], values[3].text()];
            return this._current_state;
        }, (error: any) => {
            console.log(error);
        });
    }

    constructor(private http: Http, private el: ElementRef) {
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        let image_changes = _.intersection(_.keys(changes), ['path', 'model', 'fid']);
        if (!_.isEmpty(image_changes)) {
            this.updateState().then(this.updateCanvas.bind(this));
        }
    }

}
