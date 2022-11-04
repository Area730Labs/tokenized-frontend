import type { NextApiRequest, NextApiResponse } from 'next'
import { ILayerImage } from '../../state/layerState';
import { withApiAuth } from '@supabase/auth-helpers-nextjs'
import { PrismaClient, Prisma } from '@prisma/client'
import { uuidv4 } from '../../utils';

export type SetImageRarityArgs = {
    imageUid: string,
    rarity: number
}


export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    const data:SetImageRarityArgs = req.body as SetImageRarityArgs;
    const prisma = new PrismaClient()
    const {data: { user },} = await supabase.auth.getUser()

    const imgData = await prisma.layerImage.findUnique({where: {
        uuid: data.imageUid
    }})

    if (!imgData) {
        res.status(404).send({ message: 'Image data not found' })
        return
    }

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
    const imageBlongsToUser = layerArr.findIndex(x => x.uid === imgData.layer_uid) >= 0

    if (!imageBlongsToUser) {
        res.status(500).send({ message: 'Image does not belong to current user' })
        return
    }


    await prisma.layerImage.update({
        where: {
          uuid: data.imageUid,
        },
        data: {
          rarity: data.rarity,
        },
    })

    res.status(200).json([])
})
