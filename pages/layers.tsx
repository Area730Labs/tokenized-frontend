import { 
    Box,
    Flex,
    Image,
    Spacer,
    Accordion,
    Button,
    useDisclosure,
    Spinner,
    Text
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
import { ILayer, ILayerImage } from '../state/layerState'
import { uuidv4 } from '../utils';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import { useToast } from '@chakra-ui/react'


export type UploadingImage = {
    image: ILayerImage,
    isUploading: boolean,
    uploadError: boolean,
    progress: number,
    hasStarted: boolean,
    file:any,
}


export default function Layers()
{
    const supabase = useSupabaseClient()

    const {layerData, addLayer, setLayerNameModalProps, isPublished, addLayerImage} = useAppContext();
    const [uploadState, setUploadState] = useState<Record<string, UploadingImage[]>>({});
    const toastId = useRef(null);
    const chakraToast = useToast()

    let viewData: any = [];

    useEffect(() => {
        if (!uploadState){
            return
        }

        let newState = {...uploadState}

        for (const key in newState) {
            const imgs = newState[key]
            for(let i = 0; i < imgs.length; ++i){
                const image = imgs[i]
                if (!image.hasStarted){
                    image.hasStarted = true
                    upload(image.file, 
                        // () => onFileUploaded(key, image.image.fileUid), 
                        () => {

                        },
                        () => onUploadFailed(key, image.image.fileUid),
                        key,
                        image)
                }
            }
        }
    }, [uploadState])

    const upload = async (file:any, onCompleted:()=>void, onUploadError:()=>void, layerUid:string, img: UploadingImage) => {
        const fileExt = file.name.split('.').pop()

        let { error: uploadError } = await supabase.storage
        .from('layer-images')
        //@ts-ignore
        .upload(img.image.fileUid, file, { upsert: true })

        if (uploadError) {
            // alert('upload error: ' + JSON.stringify(uploadError));
            onUploadError();
            return
        }

        const onOk = () => {
            setUploadState((prevState) => {
                let newState = {...prevState}

                let index = newState[layerUid].findIndex(x => x.image.fileUid === img.image.fileUid);
                newState[layerUid].splice(index,1)

                return newState
            })
        }

        // if file uploaded to server and state updated ok
        if (await addLayerImage(img, layerUid, onOk)) {
            // remove from uploading list as it was added to main state in addLayerImage(...)
            
        } else {
            onUploadError();
            return
        }

        onCompleted()
    }

    const onUploadFailed = (layerUid:string, imageUid:string) => {
        let newState = {...uploadState}

        const ld = newState[layerUid];

        let index = ld.findIndex(x => x.image.fileUid === imageUid);
      
        newState[layerUid][index].uploadError = true;

        setUploadState(newState)
    }

    const handleNewFiles = async (files:any[], layerUid:string) => {
        let newState = {...uploadState}

        if (!(layerUid in newState)) {
            newState[layerUid] = []
        }

        for(let i = 0; i < files.length; ++i) {
            const file = files[i]
            const fileUid = uuidv4()

            newState[layerUid].push({
                image: {
                    imageName: file.name,
                    fileUid: fileUid,
                    url: URL.createObjectURL(file),
                    rarity: 0
                },
                isUploading: true,
                uploadError: false,
                progress: 0,
                hasStarted: false,
                file,
            })
        }

        setUploadState(newState)
    }

    layerData?.map((item, index) => {
        let uploadingImages:UploadingImage[] = [];

        if (item.uid in uploadState) {
            uploadingImages = uploadState[item.uid]
        }

        viewData.push(
            <LayerBlock item={item} key={item.uid} index={index} onFilesAdded={handleNewFiles} uploadingImages={uploadingImages} />
        );
    });

    const onCreateNewLayer = () => {
        setLayerNameModalProps({
            createMode: true, 
            onOkAction: async (layerName:string) => {
                const exists = layerData.findIndex(x => x.layerName === layerName) > 0;


                if (exists) {
                    chakraToast({
                        title: `Name exists`,
                        position: 'bottom',
                        status: 'error',
                        isClosable: true,
                        duration: 2500,
                      })
                    return
                }

                //@ts-ignore
                const toastId = toast(<ToastComponent msg='Adding layer...' isLoading={true} toastId={uuidv4()} />);

                const res = await addLayer(layerName);
                toast.dismiss(toastId);

                if (res) {
                    chakraToast({
                        title: `Layer created`,
                        position: 'bottom',
                        status: 'success',
                        isClosable: true,
                        duration: 2500,
                      })
                } else {
                    chakraToast({
                        title: `Failed to create layer`,
                        position: 'bottom',
                        status: 'error',
                        isClosable: true,
                        duration: 2500,
                      })
                }
            }
        })
    };

    const ToastComponent = ({ closeToast, toastProps, msg, isLoading }:{closeToast:any, toastProps:any, msg:string, isLoading:boolean}) => (
        <Flex flexDir='row' alignItems='center'  gap={25} >
          {isLoading && (<Spinner color='green'/>)}
          <Text fontWeight='bold'>{msg}</Text>
        </Flex>
      )

   

    return (
        <Flex dir='row'> 
            <ChangeLayerNameModal  />

            <ToastContainer
                position="bottom-right"
                closeButton={false} 
                transition={Slide}
            />


           <Sidebar/>

           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} height='100vh' alignItems='center' overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Layers'/>

                <Flex width='750px' flexDir='row'>
                    {!isPublished && (
                        <>
                            <Button size='sm' leftIcon={<Icon as={BiLayer} w={5} h={5} color='#ffffff' />} colorScheme='blue' variant='solid'>
                                Generate NFTs
                            </Button>

                            <Spacer/>
                            <Button onClick={() => onCreateNewLayer()} size='sm' leftIcon={<Icon as={BiAddToQueue} w={5} h={5} color='#ffffff' />} colorScheme='green' variant='solid'>
                                Add layer
                            </Button>
                        </>
                    )}
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



export const getServerSideProps = withPageAuth({redirectTo: '/'})