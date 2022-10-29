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
import { useState, useRef, useEffect } from 'react'
import { ILayer, ILayerImage } from '../state/layerState'
import { useAppContext } from '../state/appContext'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel
} from '@chakra-ui/react'


export default function Layers()
{
    const {layerData, addLayer} = useAppContext();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef(null)

    let viewData: any = [];

    layerData.map((item, index) => {
        viewData.push(
            <LayerBlock item={item} key={index} />
        );
    });

    // useEffect(() => {
    //     onOpen();
    // }, []);

    const createLayer = () => {
        //@ts-ignore
        if (!initialRef.current?.value){
            return;
        }

        //@ts-ignore
        addLayer(initialRef.current.value);

        onClose();

        //@ts-ignore
        initialRef.current.value = '';
    };

    return (
        <Flex dir='row'> 
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Create layer</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                    <FormLabel>Layer name</FormLabel>
                    <Input ref={initialRef} placeholder='Enter layer name' />
                    </FormControl>

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={createLayer}>
                    Create
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>

           <Sidebar/>

           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} height='100vh' alignItems='center' overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Layers'/>

                <Flex width='750px' flexDir='row'>
                    <Button size='sm' leftIcon={<Icon as={BiLayer} w={5} h={5} color='#ffffff' />} colorScheme='blue' variant='solid'>
                        Generate NFTs
                    </Button>
                    <Spacer/>
                    <Button onClick={onOpen} size='sm' leftIcon={<Icon as={BiAddToQueue} w={5} h={5} color='#ffffff' />} colorScheme='green' variant='solid'>
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