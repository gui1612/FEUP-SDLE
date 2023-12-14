import { Request, Response } from "express";
import { ShoppingList } from "../models/ShoppingList";
import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";
import * as grpc from "@grpc/grpc-js";
import { QueryServiceClient } from "../proto/services/query_service_grpc_pb";
import { Context, GetRequest, PutRequest } from "../proto/services/models_pb";
import { VectorClock } from "../proto/models_pb";

const GRPC_SERVER_ADDRESS = process.env.GRPC_SERVER_ADDRESS || 'localhost:6001';

const client = new QueryServiceClient(GRPC_SERVER_ADDRESS, grpc.credentials.createInsecure());

function uuidValidateV4(uuid: string): boolean {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

function saveListToMockDb(list: ShoppingList, ctx?: Context): Promise<void> {
    const uuid = list.id;

    if (!ctx) {
        ctx = new Context();
        ctx.setVectorclock(new VectorClock());
    }
    
    const request = new PutRequest();
    request.setKey(uuid);
    request.setContext(ctx);
    request.setValue(Buffer.from(JSON.stringify(list.toJSON()), "utf-8"));

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        client.putEntry(request, (err, _response) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        })
    })
}

function bufferToShoppingList(buffer: Uint8Array): ShoppingList {
    const jsonString = Buffer.from(buffer).toString('utf-8');
    return ShoppingList.fromJSON(JSON.parse(jsonString), "<server>");
}

function loadListFromMockDb(uuid: string): Promise<[Context, ShoppingList] | null> {
    const getRequest = new GetRequest();
    getRequest.setKey(uuid);

    return new Promise((resolve, reject) => {
        client.getEntry(getRequest, (err, response) => {
            if (err) {
                return reject(err);
            }

            const ctx = response.getContext();
            const values = response.getValuesList_asU8().map(bufferToShoppingList);

            if (values.length === 0) {
                return resolve(null);
            }

            const mergedValue = values[0];
            for (let i = 1; i < values.length; i++) {
                mergedValue.merge(values[i]);
            }
            
            return resolve([ctx!, mergedValue]);
        })
    });
}

export const getList = async (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    if (!uuidValidateV4(uuid))
        return res.status(400).json({ error: "Invalid UUID Format" });

    try {
        const entry = await loadListFromMockDb(uuid);
        if (!entry) {
            return res
                .status(404)
                .json({ error: `List with UUID ${uuid} not found` });
        }

        const [ctx, list] = entry;
        await saveListToMockDb(list, ctx);

        return res.status(200).json(list.toJSON());
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const putList = async (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    if (!uuidValidateV4(uuid))
        return res.status(400).json({ error: "Invalid UUID Format" });

    const receivedList = ShoppingList.fromJSON(req.body, "<server>");

    try {
        const entry = await loadListFromMockDb(uuid);
        if (!entry) {
            await saveListToMockDb(receivedList);
            return res.status(200).json(receivedList.toJSON());
        }
        
        const [ctx, existingList] = entry;
        const mergedList = existingList.merge(receivedList);

        await saveListToMockDb(mergedList, ctx);
        return res.status(200).json(mergedList.toJSON());
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
