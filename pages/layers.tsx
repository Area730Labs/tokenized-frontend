import { 
    Box,
    Flex,
    Image,
    Spacer,
    Accordion,
    Button,
    useDisclosure
} from '@chakra-ui/react'
import Sidebar from '../components/sidebar'
import ContentHeader from '../components/contentHeader'
import 
{ 
    BiAddToQueue,
    BiLayer
} from "react-icons/bi";
import { Icon } from '@chakra-ui/react'
import LayerBlock from '../components/layerBlock'
import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../state/appContext'
import ChangeLayerNameModal from '../components/modals/changeLayerNameModal'
import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { ILayer } from '../state/layerState';


export default function Layers()
{
    const {layerData, addLayer, setLayerNameModalProps} = useAppContext();

    let viewData: any = [];

    layerData?.map((item, index) => {
        viewData.push(
            <LayerBlock item={item} key={index} index={index} />
        );
    });

    const onCreateNewLayer = () => {
        setLayerNameModalProps({
            createMode: true, 
            onOkAction: addLayer
        })
    };

    return (
        <Flex dir='row'> 
            <ChangeLayerNameModal  />

           <Sidebar/>

           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} height='100vh' alignItems='center' overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Layers'/>

                <Flex width='750px' flexDir='row'>
                    <Button size='sm' leftIcon={<Icon as={BiLayer} w={5} h={5} color='#ffffff' />} colorScheme='blue' variant='solid'>
                        Generate NFTs
                    </Button>
                    <Spacer/>
                    <Button onClick={() => onCreateNewLayer()} size='sm' leftIcon={<Icon as={BiAddToQueue} w={5} h={5} color='#ffffff' />} colorScheme='green' variant='solid'>
                        Add layer
                    </Button>
                </Flex>

                <Flex flexDir='column' gap={4} w='750px'>

                    <Accordion defaultIndex={[0]} allowMultiple width='100%'>
                        
                        {viewData}
                       
                    </Accordion>

                </Flex>
            </Flex>

        </Flex>
    )
}



export const getServerSideProps = withPageAuth({
    redirectTo: '/',
    // async getServerSideProps(ctx, supabase) {
    //     const {
    //         data: { user },
    //       } = await supabase.auth.getUser()

    //     console.log(user?.id)
        
    //     const { data:projectData } = await supabase.from('Project').select('*').eq('owner_uid', user?.id);

    //     if (projectData){
    //         const proj = projectData[0];

    //         return { props: { layers: proj.layers as Layer[] } }

    //         // const { data:layerData } = await supabase.from('layers').select('*').eq('project_id', proj.id);

    //         // if (layerData){
    //         //     return { props: { layers: layerData as Layer[] } }
    //         // }
    //     }


    //     return { props: {  } }
    // },
})