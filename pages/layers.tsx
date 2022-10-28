import { 
    Box,
    Flex,
    Image,
    Spacer,
    Text,
    Button
} from '@chakra-ui/react'
import Sidebar from '../components/sidebar'
import ContentHeader from '../components/contentHeader'
import TitleBlock from '../components/titleBlock'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    IconButton,
} from '@chakra-ui/react'

import 
{ 
    BiPencil,
    BiTrash,
    BiTrashAlt,
    BiAddToQueue,
    BiLockAlt,
    BiLockOpenAlt,
    BiLayer
} from "react-icons/bi";
import { Icon } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import LayerBlock from '../components/layerBlock'


export default function Layers()
{

    const layerData = [
        {layerName: 'Background', layerRarity: '15', images: [
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            }
        ]},
        {layerName: 'Heads', layerRarity: '15', images: [
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            }
        ]},
        {layerName: 'Eyes', layerRarity: '15', images: [
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            }
        ]},
        {layerName: 'Body', layerRarity: '15', images: [
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            },
            {
                imageName: 'Bg_1.jpg',
                url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000'
            }
        ]}
    ];

    let viewData: any = [];

    layerData.map((item, index) => {
        viewData.push(
            <LayerBlock item={item} key={index} />
        );
    });

    return (
        <Flex dir='row'> 
           <Sidebar/>

           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} height='100vh' alignItems='center' overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Layers'/>

                <Flex width='750px' flexDir='row'>
                    <Button size='sm' leftIcon={<Icon as={BiLayer} w={5} h={5} color='#ffffff' />} colorScheme='blue' variant='solid'>
                        Generate NFTs
                    </Button>
                    <Spacer/>
                    <Button size='sm' leftIcon={<Icon as={BiAddToQueue} w={5} h={5} color='#ffffff' />} colorScheme='green' variant='solid'>
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