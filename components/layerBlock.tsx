
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
import { uuidv4, selectFile } from '../utils'
import LayerImage from './layerImage';
import { UploadingImage } from '../pages/layers';

type Props = {
    item: ILayer, 
    index: number, 
    uploadingImages: UploadingImage[],
    onFilesAdded: (files:any[], layerUid:string) => void
}

export default function LayerBlock(props: Props) 
{
    const item = props.item;
    const {removeLayer, layerData, moveLayerUp, moveLayerDown, renameLayer, removeLayerImage} = useAppContext();
    const {layerNameModalProps, setLayerNameModalProps} = useAppContext()
    const [isHover, setHover] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
        } else if (e.type === "dragleave") {
          setDragActive(false);
        }
    };

    const uploadLayers = async(files:any[]) => {
        props.onFilesAdded(files, props.item.uid)
    };

    const handleDrop = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          uploadLayers(e.dataTransfer.files)
        }
      };

    const onEdit = () => {
        setLayerNameModalProps({
            createMode: false, 
            onOkAction: (val) => renameLayer(props.index, val),
            currentName: item.layerName
        })
    };

    const onUploadClick = async() => {
        const files = await selectFile("image/*", true);

        //@ts-ignore
        if (files && files[0]){
            //@ts-ignore
            uploadLayers(files)
        }
    }

    const onRemoveLayerImage = async (layerId:string, imageId:string) => {
        await removeLayerImage(layerId, imageId)
    }


   

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

            <Flex backgroundColor={dragActive?'#f9f9f9':'white'} onClick={onUploadClick} onDrop={handleDrop} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} cursor='pointer' border='2px dashed #e3e3e3' width='100%' height='60px' borderRadius='10px' marginBottom='10px' alignItems='center' justifyContent='center'>
                <Text fontWeight='bold' color='#757575'>
                    <>+ Drop images to add</>
                </Text>
            </Flex>

            {item.images.map((img:ILayerImage, index:number) => {
                return (
                    <LayerImage layerUid={props.item.uid} key={index} item={img} layerIndex={props.index} imageIndex={index} onRemoveLayerImage={onRemoveLayerImage} isUploading={false} uploadError={false} />
                );
            })}

            {props.uploadingImages.map((img:UploadingImage, index:number) => {
                return (
                    <LayerImage layerUid={props.item.uid} key={index} item={img.image} layerIndex={props.index} imageIndex={index} isUploading={img.isUploading} uploadError={img.uploadError} uploadProgress={img.progress} />
                );
            })}
            </AccordionPanel>
        </AccordionItem>
    )
}