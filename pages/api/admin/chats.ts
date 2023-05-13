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

    let chatResponses: {
        sessionId: string,
        chats: any[]
    }[] = [];

    const customers = await prisma.customer.findMany();

    customers.forEach(async customer => {
        chatResponses.push(
            {
                sessionId: customer.session_id,
                chats: [...await prisma.messages.findMany({
                    where: {
                        user_id: customer.id
                    }
                })]
            }
        )
    });

    res.status(200).json(chatResponses);
}