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
        const admin = await prisma.admin_ac.create({
            data: {
                name: req.body.name,
                employee_id: req.body.employeeId,
                password: req.body.password,
                role: "ADMIN",
                language: "",
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(404).json({ success: false });
    }
}