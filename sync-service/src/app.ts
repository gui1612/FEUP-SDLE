import 'dotenv/config';
import express from 'express';
import { AWSet } from '../lib/crdts/AWSet';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    // Semnd a json crdt

    // const shoppingList = new AWSet(new Set([
    //     [2, 'milk', 1],
    //     [1, 'bananas', 2],
    //     [3, 'bread', 3],
    //     [4, 'butter', 4],
    // ]));

    // console.log(shoppingList.values);
    // let initialSet = new Set([
    //     [1, 'a', 1],
    //     [2, 'a', 2],
    //     [3, 'b', 3]
    // ]);


    const aw = new AWSet('A');

    aw.add(1);
    aw.add(2);
    aw.remove(1);
    aw.add(1);


    // aw.merge(aw2);

    const aw2 = new AWSet('C');
    aw2.add(1);

    aw.merge(aw2);

    aw.remove(1)

    res.json(aw.toJSON())
    // res.json(aw.toJSON())

    // aw.merge(aw2);


    // dotKernel.reset()
    // dotKernel.remove(1);
    // dotKernel.removeDot(["a", 1]);
    // dotKernel.removeDot(['a', 1]);
    // res.json({ aw1: aw.toJSON(), aw2: aw2.toJSON() });

});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
