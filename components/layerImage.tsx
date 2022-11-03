import { useEffect } from "react";
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

    const onRemove = async () => {
        if (props.onRemoveLayerImage) {
            await props.onRemoveLayerImage(props.layerUid, props.item.fileUid)
        }
    }

    return (
        <Flex  backgroundColor='#21212105' marginTop='5px' marginBottom='7px'  width='100%' flexDir='row' alignItems='center'  gap='10px' border='1px solid #f0f0f0' padding='7px' borderRadius='5px' >
            <Image src={img.url} height='40px' borderRadius='4px'/>
            <Text>{img.imageName}</Text>
            <Spacer/>
            {!props.isUploading && !props.uploadError && (
                <>
                    Rarity %:
                    <Input placeholder='0' value={img.rarity} onChange={(e) => {}} width='60px'/>

                    <Flex onClick={(e) => {alert(1); e.preventDefault();}} backgroundColor='#ededed' width='40px' height='40px' marginLeft='0px' borderRadius='5px' alignItems='center' justifyContent='center' cursor='pointer'>
                        <Icon as={BiLockOpenAlt} w={5} h={5} color='#4a4a4a' />
                    </Flex>

                    <Flex cursor='pointer' onClick={(e) => {onRemove(); e.preventDefault();}} backgroundColor='#f03426' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                        <Icon as={BiTrashAlt} w={4} h={4} color='#ffffff' />
                    </Flex>
                </>
            )}

            {props.isUploading && !props.uploadError && (
                <>
                    <Progress value={props.uploadProgress} size='xs' color='#60c0d1' width='150px' />
                    <Spinner color='#60c0d1' />
                </>
            )}

            {props.uploadError && (
                <Badge colorScheme='red' fontSize='0.8em' padding={1}>Upload failed</Badge>
            )}

            
        </Flex>
    )
}