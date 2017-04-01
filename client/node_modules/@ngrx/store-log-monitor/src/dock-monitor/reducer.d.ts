import { ActionReducer } from '@ngrx/store';
export declare const POSITIONS: string[];
export declare type PositionsType = 'left' | 'top' | 'right' | 'bottom';
export interface DockState {
    position?: PositionsType;
    visible?: boolean;
    size?: number;
}
export declare function useDockMonitor(_options?: DockState): ActionReducer<DockState>;
