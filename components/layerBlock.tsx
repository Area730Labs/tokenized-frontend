
import { 
    Box,
    Flex,
    Image,
    Spacer,
    Text,
    useDisclosure,
    Button,
    Spinner
} from '@chakra-ui/react'
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { ToastContainer, toast } from 'react-toastify';
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
import { useState, useRef, useEffect } from 'react'
import { ILayer, ILayerImage } from '../state/layerState';
import { useAppContext } from '../state/appContext';
import { uuidv4, selectFile } from '../utils'
import LayerImage from './layerImage';
import { UploadingImage } from '../pages/layers';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';

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
    const [isRemoving, setIsRemoving] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef(null)
    const toastId = useRef(null);

    useEffect(() => {
        return () => {
            if (toastId.current){
                toast.dismiss(toastId.current);
            }
        }
    }, [])

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

    const ToastComponent = ({ closeToast, toastProps }:{closeToast:any, toastProps:any}) => (
        <Flex flexDir='row' alignItems='center'  gap={25} >
          <Spinner color='red'/>
          <Text fontWeight='bold'>Removing layer...</Text>
        </Flex>
      )



    const onRemove = async()=>{
        setIsRemoving(true)


        //@ts-ignore
        // toastId.current = toast(<ToastComponent autoClose={false} toastId={props.item.uid} />);

        const response = await removeLayer(item.uid)

        if (!response) {
            setIsRemoving(false)
        }

    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete layer [{item.layerName}]?
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you sure? This action can&apos;t be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={() => {onRemove(); onClose()}} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        
            <ToastContainer
                position="bottom-right"
                autoClose={false}
                closeButton={false} 
                transition={Slide}
            />

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
                    {item.layerName} ({item.images.length} images)
                    </Box>

                    {isHover && !isRemoving && props.index > 0 && (
                        <Flex onClick={(e) => { moveLayerUp(props.index); e.preventDefault();}} backgroundColor='#ededed' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                            <Icon as={BiChevronUp} w={4} h={4} color='#4a4a4a' />
                        </Flex>
                    )}

                    {isHover && !isRemoving && props.index < layerData.length - 1 && (
                        <Flex onClick={(e) => {moveLayerDown(props.index); e.preventDefault();}} backgroundColor='#ededed' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                            <Icon as={BiChevronDown} w={4} h={4} color='#4a4a4a' />
                        </Flex>
                    )}

                
                    {isHover && !isRemoving && (
                        <Flex onClick={(e) => {onEdit(); e.preventDefault();}} backgroundColor='#ededed' width='35px' height='35px' marginLeft='20px' borderRadius='5px' alignItems='center' justifyContent='center'>
                            <Icon as={BiPencil} w={4} h={4} color='#4a4a4a' />
                        </Flex>
                    )}
                    
                    {isHover && !isRemoving && (
                        <Flex onClick={(e) => {onOpen(); e.preventDefault();}} backgroundColor='#f03426' width='35px' height='35px' marginLeft='10px' borderRadius='5px' alignItems='center' justifyContent='center'>
                            <Icon as={BiTrashAlt} w={4} h={4} color='#ffffff' />
                        </Flex>
                    )}

                    {isRemoving && (<Spinner color='red' />)}
                    
                    
                </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>

                {!isRemoving && (
                    <Flex backgroundColor={dragActive?'#f9f9f9':'white'} onClick={onUploadClick} onDrop={handleDrop} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} cursor='pointer' border='2px dashed #e3e3e3' width='100%' height='60px' borderRadius='10px' marginBottom='10px' alignItems='center' justifyContent='center'>
                        <Text fontWeight='bold' color='#757575'>
                            <>+ Drop images to add</>
                        </Text>
                    </Flex>
                )}

                {!isRemoving && item.images.map((img:ILayerImage, index:number) => {
                    return (
                        <LayerImage layerUid={props.item.uid} key={img.fileUid} item={img} layerIndex={props.index} imageIndex={index} onRemoveLayerImage={onRemoveLayerImage} isUploading={false} uploadError={false} />
                    );
                })}

                {!isRemoving && props.uploadingImages.map((img:UploadingImage, index:number) => {
                    return (
                        <LayerImage layerUid={props.item.uid} key={img.image.fileUid} item={img.image} layerIndex={props.index} imageIndex={index} isUploading={img.isUploading} uploadError={img.uploadError} uploadProgress={img.progress} />
                    );
                })}
                </AccordionPanel>
            </AccordionItem>
        </>
        
    )
}