import { Model } from './model';
export declare class Core {
    private model;
    constructor(model: Model);
    authenticate(): void;
    permission(): void;
}
