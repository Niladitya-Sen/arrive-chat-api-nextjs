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

    const admin = await prisma.admin_ac.findFirst({
        where: {
            employee_id: req.body.employeeId
        }
    });

    if (!admin) {
        res.status(404).json({ "success": false });
    } else {
        if (admin?.password === req.body.password && admin?.employee_id === req.body.employeeId) {
            await prisma.admin_ac.update({
                where: {
                    employee_id: req.body.employeeId
                },
                data: {
                    language: req.body.language
                }
            })
            res.status(200).json({ "success": true });
        } else {
            res.status(404).json({ "success": false });
        }
    }
}