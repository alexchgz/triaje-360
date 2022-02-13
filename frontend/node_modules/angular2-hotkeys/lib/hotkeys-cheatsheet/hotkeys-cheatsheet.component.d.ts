import { OnDestroy, OnInit } from '@angular/core';
import { Hotkey } from '../hotkey.model';
import { HotkeysService } from '../hotkeys.service';
import { Subscription } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class HotkeysCheatsheetComponent implements OnInit, OnDestroy {
    private hotkeysService;
    helpVisible: boolean;
    title: string;
    subscription: Subscription;
    hotkeys: Hotkey[];
    constructor(hotkeysService: HotkeysService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    toggleCheatSheet(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<HotkeysCheatsheetComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<HotkeysCheatsheetComponent, "hotkeys-cheatsheet", never, { "title": "title"; }, {}, never, never>;
}

//# sourceMappingURL=hotkeys-cheatsheet.component.d.ts.map