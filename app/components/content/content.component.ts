import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RecordService } from '../../common/record.service'

@Component({
    selector: 'content-page',
    template: require('./content.component.html'),
    styles: [require('./content.component.css')]
})
export class ContentComponent {
    @ViewChild('snackbar') snackbarRef;
    @ViewChild('progressbar') progressRef;

    fid: number = 0;
    total_frames: number = this.recorder.framelist.length;
    constructor(
        private recorder: RecordService
    ) {
        this.fid = 1;
    }

    get frameid(){
        return this.recorder.framelist[this.fid-1];
    }

    updateprogress(fid: number) {
        if (fid > this.total_frames) {
            this.recorder.submit();
            this.snackbarRef.nativeElement.MaterialSnackbar.showSnackbar({
                message: `You have finished the test`,
                timeout: 1000,
                actionText: 'RESTART',
                actionHandler: () => {
                    this.updateprogress(1);
                }
            });
            return;
        }
        this.fid = fid;
        this.progressRef.nativeElement.MaterialProgress.setProgress(100 * this.fid / this.total_frames);
    }

    choose(id: string) {
        this.recorder.put(this.fid, id);
        var fid = this.fid;
        this.snackbarRef.nativeElement.MaterialSnackbar.showSnackbar({
            message: `You have chosen id for ${this.fid}`,
            timeout: 1000,
            actionText: 'UNDO',
            actionHandler: () => {
                this.updateprogress(fid);
                this.recorder.remove(fid);
            }
        });
        this.updateprogress(fid + 1);
    }
}
