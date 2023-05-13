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

    try {
        const newCustomer = await prisma.customer.create({
            data: {
                session_id: req.body.sessionId,
                role: 'CUSTOMER',
                language: req.body.language,
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(404).json({ success: false });
    }
}