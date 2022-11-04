import type { NextApiRequest, NextApiResponse } from 'next'
import { ILayerImage } from '../../state/layerState';
import { withApiAuth } from '@supabase/auth-helpers-nextjs'
import { PrismaClient, Prisma } from '@prisma/client'



export type RemoveLayerImageArgs = {
    layerId: string,
    imageId: string
}


export default withApiAuth(async function ProtectedRoute(req, res, supabase) {
    let start = performance.now();


    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    const reqData:RemoveLayerImageArgs = req.body as RemoveLayerImageArgs;

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

    await prisma.layerImage.deleteMany({where: {
        project_id: projectData.id,
        uuid: reqData.imageId
    }})

    const { error } = await supabase
    .storage
    .from('layer-images')
    .remove([reqData.imageId])

    console.log(`function removeLayerImage took ${(performance.now() - start).toFixed(3)}ms`);


    res.status(200).json([])
})
