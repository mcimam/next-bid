import prisma from '../../../lib/prisma'


export default async function handler(req, res) {
    // get user bid
    if(req.method == "GET"){
        const productid = req.query.productId || null; 
        const userId = req.query.userId || null;
        
    // check your last bid
    const lastBid = await prisma.ProductBid.findFirst({
        select: {
            bid: true
        },
        where: {
            productId: productid,
            userId : userId
        },
        orderBy: {
            bid : 'desc'
        }
    })
    const finalBid = lastBid ? lastBid["bid"]: 0;

    return res.status(200).json({bid :finalBid});
    }




    // bid product
    if(req.method == "POST"){
        const switchAuto = (req.body.switchAuto == "true");
        const productid = req.body.productId || null; 
        const userId = req.body.userId || null;
        const bid = parseInt(req.body.bid) || null
        const autoBid = (req.body.autoBid == "true");
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
        if(!switchAuto && bid <= minBid){
            return res.status(200).json(`Error : Bid Not Enough ${bid <= minBid}`);                
        }

        // select data depend on switchAuto Parameter
        let updateData = {};
        let insertData = {};
        if(switchAuto){
            updateData = {
                autoBid : autoBid
            }
    
            insertData = {                
                productId : productid,
                userId : userId,
                bid : 0,
                autoBid: autoBid
            }
    
        }else{
            updateData = {
                bid : bid,
                autoBid : autoBid
            }
    
            insertData = {                
                productId : productid,
                userId : userId,
                bid : bid,
                autoBid: autoBid
            }
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
            update: updateData,
            create: insertData

        })
        if(switchAuto){
            return res.status(201).json(`Autobid : ${autoBid}`);
        }
        else {
            return res.status(201).json(`Bid ${bid}`);

        }
    }

    
    return res.status(405).json("Method Not Allowed")


}