import { useEffect, useState } from "react";
import { Flex, Text, Spacer, Input, Icon, Image, Spinner, Badge, Progress } from "@chakra-ui/react";
import 
{ 
    BiPencil,
    BiTrashAlt,
    BiLockOpenAlt,
    BiChevronUp,
    BiChevronDown,
} from "react-icons/bi";
import { ILayerImage } from "../state/layerState";
import { ToastContainer, toast } from 'react-toastify';
import RarityView from "./rarityView";

type ImageProps = {
    item: ILayerImage, 
    layerIndex: number, 
    imageIndex:number, 
    onRemoveLayerImage?: (layerId:string, imageId:string) => void,
    isUploading: boolean,
    uploadError: boolean,
    uploadProgress?: number,
    layerUid:string
}

export default function LayerImage(props: ImageProps) {
    const img = props.item;
    const [isRemoving, setIsRemoving] = useState(false);
    const [isHover, setHover] = useState(false);


    const onRemove = async () => {
        if (props.onRemoveLayerImage) {
            setIsRemoving(true)
            await props.onRemoveLayerImage(props.layerUid, props.item.fileUid)
        }
    }

    const handleChange = (event:any) => {
        event.target.value
    }

    return (
        <Flex onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}  backgroundColor='#21212105' marginTop='5px' marginBottom='7px'  width='100%' flexDir='row' alignItems='center'  gap='10px' border='1px solid #f0f0f0' padding='7px' borderRadius='5px' >
             {isHover && !isRemoving && (
                <Flex cursor='pointer' onClick={(e) => {onRemove(); e.preventDefault();}} backgroundColor='#f03426' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                    <Icon as={BiTrashAlt} w={4} h={4} color='#ffffff' />
                </Flex>
            )}
            <Image src={img.url} height='40px' borderRadius='4px'/>
            <Text>{img.imageName}</Text>
            <Spacer/>
            {!props.isUploading && !isRemoving && !props.uploadError && (
                <>
                {/* <Flex cursor='pointer' flexDir='row' gap={2} backgroundColor='#f1f1f1' padding='5px' paddingLeft='8px' paddingRight='8px' borderRadius='5px' alignItems='center'>
                    Rarity %:
                    <Text>{img.rarity}</Text>
                    <Icon as={BiPencil} w={4} h={4} color='#4a4a4a' />
                </Flex> */}

                <RarityView rarity={img.rarity} imageUid={img.fileUid} layerUid={props.layerUid} />
                    
                    {/* <Input placeholder='0' type="number" value={img.rarity} onChange={(e) => {}} width='60px'/> */}

                    {/* <Flex onClick={(e) => {alert(1); e.preventDefault();}} backgroundColor='#ededed' width='40px' height='40px' marginLeft='0px' borderRadius='5px' alignItems='center' justifyContent='center' cursor='pointer'>
                        <Icon as={BiLockOpenAlt} w={5} h={5} color='#4a4a4a' />
                    </Flex> */}

                   
                </>
            )}

            {props.isUploading && !props.uploadError && (
                <>
                    <Spinner color='#60c0d1' />
                </>
            )}

            {props.uploadError && (
                <Badge colorScheme='red' fontSize='0.8em' padding={1}>Upload failed</Badge>
            )}

            {isRemoving && <Spinner color='red' />}

            
        </Flex>
    )
}