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
    if (req.method !== 'POST') {
        res.status(404).send("Not Allowed");
    }
    const customer = await prisma.customer.findFirst({
        where: {
            session_id: req.body.sessionId
        }
    });

    if (customer) {
        const newMsg = await prisma.messages.create({
            data: {
                user_id: customer.id,
                msg_by: req.body.msgBy,
                text: req.body.text,
                language: req.body.language,
                time: req.body.time
            }
        });
        res.status(200).json({ success: true })
    } else {
        res.status(404).send("Not Allowed");
    }
}