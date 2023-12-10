import { AWSet } from "./AWSet";
import { CCounter } from "./CCounter";
import { DotContext } from "./DotContext";
import { EWFlag } from "./EWFlag";

type CRDT<K, T> = 
    | AWORMap<K, CRDT<K, T>>
    | AWSet<K, T>
    | CCounter<T>
    | EWFlag<T>;

class AWORMap<K, T extends CRDT<K, unknown>> {
    
    private id: T;
    private map: Map<K, T> = new Map();
    private dotContext: DotContext<K> = new DotContext();

    constructor(parameters) {
        
    }
    
}

export class { AWORMap }