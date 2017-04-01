import { Action } from '@ngrx/store';
export declare class DockActions {
    static TOGGLE_VISIBILITY: string;
    toggleVisibility(): Action;
    static CHANGE_POSITION: string;
    changePosition(): Action;
    static CHANGE_SIZE: string;
    changeSize(size: number): Action;
    static CHANGE_MONITOR: string;
    changeMonitor(): Action;
}
