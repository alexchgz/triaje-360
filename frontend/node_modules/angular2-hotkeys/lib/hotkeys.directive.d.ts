import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ExtendedKeyboardEvent } from './hotkey.model';
import { HotkeysService } from './hotkeys.service';
import 'mousetrap';
import * as ɵngcc0 from '@angular/core';
export declare class HotkeysDirective implements OnInit, OnDestroy {
    private hotkeysService;
    private elementRef;
    hotkeys: {
        [combo: string]: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent;
    }[];
    private mousetrap;
    private hotkeysList;
    private oldHotkeys;
    constructor(hotkeysService: HotkeysService, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<HotkeysDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<HotkeysDirective, "[hotkeys]", never, { "hotkeys": "hotkeys"; }, {}, never>;
}

//# sourceMappingURL=hotkeys.directive.d.ts.map