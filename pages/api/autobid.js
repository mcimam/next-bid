import prisma from '../../lib/prisma'

export default async function handler(req, res) {
    // Autobid for each product
    if(req.method == "GET"){
        // get maximum bid 
        let highBid = await prisma.ProductBid.findFirst({
                where: {
                    productId: 'ckzqhrv2m0064dswgbnw44pd5'
                },
                orderBy: {
                    bid : 'desc'
                }
            })


        // get all auto bid
        const autoBidList = await prisma.productBid.findMany({
            where: {
                // product is still on sale
                product : {
                    is : {
                        endBid : {
                            gte : new Date()
                        }        
                    }
                },
                // autobid for this product is on
                autoBid : true,
            },
            include : {
                user : {
                    select: {
                        autoBid : {
                            select : {
                                maxBid: true,
                                warnBidV: true,
                                active: true
                            }
                        }
                    }
                },
            }
        })

        // copy list to bid arena
        let bidList = autoBidList.slice(0);


        // get total bid for each user
        const totalBidList = await prisma.productBid.groupBy({
            by:['userId'],
            _sum: {
                bid : true,
            },
            where: {
                // product is still on sale
                product : {
                    is : {
                        endBid : {
                            gte : new Date()
                        }        
                    }
                }
            }
        })

        // copy total bid per user and make it object
        let totalList = {};
        totalBidList.map((user)=> {
            totalList[user.userId] = user._sum.bid;
        })

        // Play the bid bot
        let maxBid = highBid["bid"]
        let player = bidList.length
        let cloop = 0;
        let minMaxBid = 999999999;
        let activePlayer = new Array(player);
        while(player > 1){

            for(let i = 0; i<bidList.length; i++){

                if(activePlayer[i] != undefined){
                    // console.log(i + "is pass");
                    continue;
                }
                //assign variable
                let userMaxBid = bidList[i].user.autoBid.maxBid;
                
                //run for firstime
                if(cloop == 0) {
                    //reduce total bidlist
                    //totalList[bidList[i].userId] -= bidList[i].bid
                    minMaxBid = minMaxBid > userMaxBid ? userMaxBid : minMaxBid;
                    bidList[i].user.autoBid.cMaxBid = userMaxBid - totalList[bidList[i].userId] + bidList[i].bid;
                }

                //assign variable again
                let userCMaxBid = bidList[i].user.autoBid.cMaxBid;


                // console.log(i+"|-|"+ +bidList[i].bid +"|"+userCMaxBid + "|" + maxBid)
                    
                //check leftover money
                if(userCMaxBid - bidList[i].bid <= 1){
                    // console.log(i + "eliminated");
                    activePlayer[i] = 0;
                    player -= 1;
                    continue;
                }

                //bid -> maxbid + 1 if userleftbid > maxbid  else bid=userleftbid
                if(userCMaxBid > maxBid){
                    maxBid = maxBid < bidList[i].bid ? bidList[i].bid : maxBid;                
                    bidList[i].bid = maxBid + 1;
                    //console.log(i+"|1|"+ +bidList[i].bid +"|"+userCMaxBid + "|" + maxBid)
                    
                }else{
                    //console.log(i+"|2|"+ +bidList[i].bid +"|"+userCMaxBid + "|" + maxBid)
                    bidList[i].bid = userCMaxBid
                }

                //bid -> minMaxBid if userleftbid > minMaxBid else bid = userleftbid
                if(userCMaxBid > minMaxBid){
                    //console.log(i+"|3|"+ +bidList[i].bid +"|"+userCMaxBid + "|" + maxBid)

                    bidList[i].bid = minMaxBid + 1;
                }else{
                    //console.log(i+"|4|"+ +bidList[i].bid +"|"+userCMaxBid + "|" + maxBid +"|"+ minMaxBid)
                }

                minMaxBid = minMaxBid > userMaxBid ? userMaxBid : minMaxBid;
            }

            if(cloop == 0){}

            cloop++;
            if(cloop > 50){break;}
        }     

        //upsert data
        //REMEMBER : better to use bulk update
        bidList.map(async (bid) => {
            const resulsts = await prisma.productBid.update({
                where: {
                    id : bid.id,
                },
                data: {
                    bid : bid.bid
                }
            })
        })
        
        return res.status(200).json(bidList);
    }

    return res.status(405).json("Method Not Allowed")

}