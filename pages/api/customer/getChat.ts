import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'
import NextCors from 'nextjs-cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
    });

    if (req.method !== 'GET') {
        res.status(404).send("Not Allowed");
    }

    const customer = await prisma.customer.findFirst({
        where: {
            session_id: req.query.sessionId?.toString()
        }
    });

    if (!customer) {
        res.status(404).send("Not Avaliable");
    } else {
        res.status(200).json(await prisma.messages.findMany({
            where: {
                user_id: Number(customer?.id)
            }
        }))
    }
}