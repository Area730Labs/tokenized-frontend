import type { NextApiRequest, NextApiResponse } from 'next'
import { ILayerImage } from '../../state/layerState';
import { withApiAuth } from '@supabase/auth-helpers-nextjs'
import { PrismaClient, Prisma } from '@prisma/client'
import { uuidv4 } from '../../utils';

export type RemoveLayerArgs = {
    layerId: string
}


export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    const data:RemoveLayerArgs = req.body as RemoveLayerArgs;
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

    const layerArr = (projectData.layers as Prisma.JsonArray);
    //@ts-ignore
    const layerIndex = layerArr.findIndex(x => x.uid === data.layerId)

    if (layerIndex < 0) {
        res.status(500).send({ message: 'Layer not found' })
        return
    }

    layerArr.splice(layerIndex, 1)

    const updateProject = await prisma.project.update({
        where: {
          id: projectData.id,
        },
        data: {
          layers: layerArr,
        },
    })

    const layerImages = await prisma.layerImage.findMany({where:{
        layer_uid: data.layerId,
        project_id: projectData.id
    }})

    let imgIds = []

    for (let i = 0; i < layerImages.length; ++i){
        imgIds.push(layerImages[i].uuid)
    }

    const { error } = await supabase
        .storage
        .from('layer-images')
        .remove(imgIds)

    await prisma.layerImage.deleteMany({where:{
        layer_uid: data.layerId,
        project_id: projectData.id
    }})

    res.status(200).json([])
})
