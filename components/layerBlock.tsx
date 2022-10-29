
import { 
    Box,
    Flex,
    Image,
    Spacer,
    Text,
    useDisclosure
} from '@chakra-ui/react'
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

import 
{ 
    BiPencil,
    BiTrashAlt,
    BiLockOpenAlt,
    BiChevronUp,
    BiChevronDown,
} from "react-icons/bi";
import { Icon } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { useState } from 'react'
import { ILayer, ILayerImage } from '../state/layerState';
import { useAppContext } from '../state/appContext';


export default function LayerBlock(props: {item: ILayer, index: number}) 
{
    const item = props.item;
    const {removeLayer, layerData, moveLayerUp, moveLayerDown, renameLayer} = useAppContext();
    const {layerNameModalProps, setLayerNameModalProps} = useAppContext()
    const [isHover, setHover] = useState(false);

    const onEdit = () => {
        setLayerNameModalProps({
            createMode: false, 
            onOkAction: (val) => renameLayer(props.index, val),
            currentName: item.layerName
        })
    };

    return (
        <AccordionItem>
            <h2>
            <AccordionButton 
                width='100%' 
                height='55px'
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >

                <AccordionIcon />

                <Box flex='1' textAlign='left' marginLeft='10px'>
                {item.layerName}
                </Box>

                {isHover && props.index > 0 && (
                    <Flex onClick={(e) => { moveLayerUp(props.index); e.preventDefault();}} backgroundColor='#ededed' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                        <Icon as={BiChevronUp} w={4} h={4} color='#4a4a4a' />
                    </Flex>
                )}

                {isHover && props.index < layerData.length - 1 && (
                    <Flex onClick={(e) => {moveLayerDown(props.index); e.preventDefault();}} backgroundColor='#ededed' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                        <Icon as={BiChevronDown} w={4} h={4} color='#4a4a4a' />
                    </Flex>
                )}

            
                {isHover && (
                    <Flex onClick={(e) => {onEdit(); e.preventDefault();}} backgroundColor='#ededed' width='35px' height='35px' marginLeft='20px' borderRadius='5px' alignItems='center' justifyContent='center'>
                        <Icon as={BiPencil} w={4} h={4} color='#4a4a4a' />
                    </Flex>
                )}
                
                {isHover && (
                    <Flex onClick={(e) => {removeLayer(item.layerName); e.preventDefault();}} backgroundColor='#f03426' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                        <Icon as={BiTrashAlt} w={4} h={4} color='#ffffff' />
                    </Flex>
                )}
                
                
            </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>

            <Flex cursor='pointer' border='2px dashed #e3e3e3' width='100%' height='60px' borderRadius='10px' marginBottom='10px' alignItems='center' justifyContent='center'>
                <Text fontWeight='bold' color='#757575'>
                    + Drop images to add
                </Text>
            </Flex>

            {item.images.map((img:ILayerImage, index:number) => {
                return (
                    <Flex key={index} backgroundColor='#21212105' marginTop='5px' marginBottom='7px'  width='100%' flexDir='row' alignItems='center'  gap='10px' border='1px solid #f0f0f0' padding='7px' borderRadius='5px' >
                        <Image src={img.url} height='40px' borderRadius='4px'/>
                        <Text>{img.imageName}</Text>
                        <Spacer/>
                        Rarity %:
                        <Input placeholder='0' value={img.rarity} width='60px'/>

                        <Flex onClick={(e) => {alert(1); e.preventDefault();}} backgroundColor='#ededed' width='40px' height='40px' marginLeft='0px' borderRadius='5px' alignItems='center' justifyContent='center' cursor='pointer'>
                            <Icon as={BiLockOpenAlt} w={5} h={5} color='#4a4a4a' />
                        </Flex>

                        <Flex cursor='pointer' onClick={(e) => {alert(1); e.preventDefault();}} backgroundColor='#f03426' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                            <Icon as={BiTrashAlt} w={4} h={4} color='#ffffff' />
                        </Flex>
                    </Flex>
                );
            })}
            </AccordionPanel>
        </AccordionItem>
    )
}