/// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import NextJS Components

// import PrismaClient
import prisma from '../../../lib/prisma'


export default async function handler(req, res) {
    const {productid} = req.query;
       
    // get product detail
    if(req.method == "GET"){

        // Get Bid List
        if(req.query.lastbid){
            const results = await prisma.ProductBid.findFirst({
                where: {
                    productId: productid
                },
                orderBy: {
                    bid : 'desc'
                }
            })
            return res.status(200).json(results)    

        }


        const results = await prisma.Product.findUnique({
            where: {
                id : productid
            }
        })
        return res.status(200).json(results)    
    }

    // bid product
    if(req.method == "POST"){
        const userId = req.body.userId || null;
        const bid = parseInt(req.body.bid) || null
        const autoBid = (req.body.autoBid == true);
        if(productid == null && userId == null, bid == null){
            return res.status(406).json("Request Variable Not Valid")    
        }
        

        // check if there is another bid
        const highBid = await prisma.ProductBid.findFirst({
            select: {
                bid: true
            },
            where: {
                productId: productid
            },
            orderBy: {
                bid : 'desc'
            }
        })


        // set  minimum bid
        const minBid = highBid ? highBid["bid"]: 4;
        
        // cancel add to db if less than minimun bid
        if (bid <= minBid){
            return res.status(200).json("Error : Bid Not Enough")
        }

        const results = await prisma.ProductBid.upsert({
            where: {
                product_user: {
                    productId: 'ckzqhrv2m0064dswgbnw44pd5',
                    userId: 'ckzqhug2p0128dswg3z1lmyzq'
                }
                // AND : [
                //     {productId : productid},
                //     {userId : userId},
                // ]
            },
            update: { bid : bid, autoBid : autoBid},
            create: {
                productId : productid,
                userId : userId,
                bid : bid,
                autoBid: autoBid,
            }

        })

        return res.status(201).json("Bid " + bid);
    }

    
    return res.status(405).json("Method Not Allowed")

}
