import 'dotenv/config';
import express from 'express';
import { DotKernel } from '../lib/crdts/DotKernel';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    // Semnd a json crdt
    const dotKernel = new DotKernel();
    dotKernel.add('a', 1);
    dotKernel.add('a', 2);
    dotKernel.add('b', 1);
    dotKernel.add('c', 1);

    
    const dotKernel2 = new DotKernel();
    dotKernel2.add('a', 4);
    dotKernel2.add('c', 5);
    dotKernel2.add('d', 1);


    // dotKernel.reset()
    // dotKernel.remove(1);
    res.send(dotKernel.values())
    dotKernel.reset();
    // dotKernel.removeDot(["a", 1]);
    // dotKernel.removeDot(['a', 1]);
    res.json({ dotKernel: dotKernel.toJSON(), dotKernel2: dotKernel2.toJSON() });

});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
