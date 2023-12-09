import { AWSet } from "./DotKernel";
import { DotContext } from "./DotContext";

class CCounter<K> {

    private awset: AWSet<number, K> = new AWSet();
    private id: K;

    // make a constructor that receives an id and an awset or a dotcontext
    // constructor(dotContext?: DotContext<K>, id: K) {
    //     this.awset = new AWSet();
    //     this.id = id;
    //     if (dotContext) {
    //         for (const [key, value] of dotContext.entrySet) {
    //             this.awset.add(this.id, value);
    //         }
    //     }
    // }

    constructor(awset?: AWSet<number, K>, id: K) {
        this.awset = awset ?? new AWSet();
        this.id = id;
        
    }


    inc(value: number = 1) {
        for (const [replicaValue, replicaId, ] of this.awset.entrySet) {
            if (this.id === replicaId) {
                this.awset.remove(this.id, replicaValue);
                break;
            }
            this.awset.add(this.id, value + replicaValue);
        }
    }

    dec(value: number = 1) {
        for (const [replicaValue, replicaId, ] of this.awset.entrySet) {
            if (this.id === replicaId) {
                this.awset.remove(this.id, replicaValue);
                this.awset.add(this.id, replicaValue - value);
                break;
            }
        }
    }

    reset() {
        this.awset.reset();
    }

    merge(cc: CCounter<K>) {
        this.awset.merge(cc.awset);
    }
}

export { CCounter };