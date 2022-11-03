import type { NextApiRequest, NextApiResponse } from 'next'
import { ILayerImage } from '../../state/layerState';
import { withApiAuth } from '@supabase/auth-helpers-nextjs'
import { PrismaClient, Prisma } from '@prisma/client'
import { uuidv4 } from '../../utils';

export type AddLayerImageArgs = {
    layerId: string,
    image: ILayerImage
}


export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    const data:AddLayerImageArgs = req.body as AddLayerImageArgs;

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

    //@ts-ignore
    const isOwner = (projectData.layers as Prisma.JsonArray).findIndex(x => x.uid === data.layerId) >= 0

    if (!isOwner) {
        res.status(500).send({ message: 'Layer not found' })
        return
    }

    await prisma.layerImage.create({data: {
        uuid: data.image.fileUid,
        layer_uid: data.layerId,
        url: data.image.url,
        file_name: data.image.imageName,
        rarity: data.image.rarity,
        project_id: projectData.id
    }})

    res.status(200).json([])
})
