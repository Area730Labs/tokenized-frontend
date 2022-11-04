import type { NextApiRequest, NextApiResponse } from 'next'
import { ILayer, ILayerImage } from '../../state/layerState';
import { withApiAuth } from '@supabase/auth-helpers-nextjs'
import { PrismaClient, Prisma } from '@prisma/client'
import { uuidv4 } from '../../utils';


export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
    let start = performance.now();

    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' })
        return
    }

    const prisma = new PrismaClient()
    const {data: { user },} = await supabase.auth.getUser()

    const projectData = await prisma.project.findFirst({
        where: {
            owner_uid: user?.id
        }
    })

    if (!projectData){
        res.status(404).send({ message: 'Project data not found' })
        return
    }

    const imageData = await prisma.layerImage.findMany({where:{
        project_id: projectData.id
    }})

    let layerDataA: any [] = projectData.layers as Prisma.JsonArray;
    let layerData = layerDataA as ILayer[];

    let layerIdMap:Record<string, ILayer> = {}

    layerData.forEach((item) => {
        item.images = []
        layerIdMap[item.uid] = item
    })

    imageData.forEach(img => {
        layerIdMap[img.layer_uid].images.push({
            imageName: img.file_name,
            fileUid:img.uuid,
            url: img.url,
            rarity: img.rarity,
        })
    })

    console.log(`function GetLayerData took ${(performance.now() - start).toFixed(3)}ms`);
    
    res.status(200).json(layerData)
})
