import { CCounter } from "./CCounter";
import { DotContext } from "./DotContext";

type CRDT<K, T> = 
    | AWORMap<K, T>
    | CCounter<T>

class AWORMap<K, T> {
    
    private id: T;
    private map: Map<K, CRDT<K, T>> = new Map();
    private dotContext: DotContext<K> = new DotContext();

    constructor(parameters) {
        
    }
    
}