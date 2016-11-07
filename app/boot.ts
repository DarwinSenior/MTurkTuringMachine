import 'core-js';
import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { HelpComponent } from './components/help/help.component'
import { ContentComponent } from './components/content/content.component'
import { CanvasComponent } from './components/content/canvas.component'

@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [
        AppComponent,
        HelpComponent,
        ContentComponent,
        CanvasComponent,
    ],
    bootstrap: [AppComponent]
})
class AppModule {
}

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
