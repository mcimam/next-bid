/// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const isStart = req.query.isStart || null;
  if (isStart){
    let results = null;
    if (isStart == 1) {
      results = await prisma.Product.findMany({
        where: { 
          AND : [
            {
              startBid : {
                lte : new Date()
              }            
            },
            {
              endBid : {
                gte : new Date()
              }    
            }
          ]
        }
      });
    }
    else {
      results = await prisma.Product.findMany({
        where: { 
          NOT : {
            AND : [
              {
                startBid : {
                  lte : new Date()
                }            
              },
              {
                endBid : {
                  gte : new Date()
                }    
              }
            ]  
          }
        }
      });
    }
    return res.status(200).json(results)

  }
  const results = await prisma.Product.findMany();
  return res.status(200).json(results)
}
