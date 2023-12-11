import 'dotenv/config';
import express from 'express';
import { CCounter } from '../lib/crdts/CCounter';
import { AWORMap } from '../lib/crdts/AWORMap';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {

    const aw1 = new AWORMap<string, CCounter<string>, string>("A");
    const aw2 = new AWORMap<string, CCounter<string>, string>("B");

    const cc1 = new CCounter("CC1", undefined, aw1.ctx);
    aw1.set("conflict", cc1);  
    
    aw1.get("conflict")?.inc(6);

    const cc2 = new CCounter("CC2", undefined, aw2.ctx);
    aw2.set("conflict", cc2);
    aw2.get("conflict")?.inc(4);

    aw1.merge(aw2);

    console.log(JSON.stringify(aw1.toJSON(), null, 2));
    
    res.json(aw1.toJSON());
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
