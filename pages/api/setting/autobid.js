/// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
    // save bid profile
    if(req.method == 'POST'){
        const userId = req.body.userId || null;
        const maxBid = parseInt(req.body.maxBid) || 0;
        const warnBidP = parseFloat(req.body.warnBidP) <= 1 ? parseFloat(req.body.warnBidP) : 1;
        const warnBidV = Math.round(maxBid * warnBidP);
        const active = (req.body.autoBid == true);

        const results = await prisma.AutoBidProfile.upsert({
            where: {
                userId: userId,
            },
            update: {
                maxBid : maxBid,
                warnBidP : warnBidP,
                warnBidV: warnBidV,
                autoBid : active,
            },
            create: {
                userId : userId,
                maxBid : maxBid,
                warnBidP : warnBidP,
                warnBidV: warnBidV,
                autoBid : active,
            }
        })

        return res.status(200).json("Upsert Success");
    }

    // get bid profile
    if(req.method == 'GET'){
        const userId = req.query.userId || null;
        if (!userId){
            return res.status(406).json("Request Variable Not Valid");
        }
        const results = await prisma.AutoBidProfile.findUnique({
            where : {
                userId : userId
            }
        })
        return res.status(200).json(results);
        
    }
        
    return res.status(405).json("Method Not Allowed")


}
