import { 
    Box,
    Flex,
    Image,
    Spacer,
    Text,
    Spinner
} from '@chakra-ui/react'
import Sidebar from '../components/sidebar'
import ContentHeader from '../components/contentHeader'
import TitleBlock from '../components/titleBlock'
import { useState, useEffect } from 'react'
import { useAppContext } from '../state/appContext'
import { withPageAuth } from '@supabase/auth-helpers-nextjs'
import { Project } from '../lib/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { BiPlusMedical } from "react-icons/bi";
import { Icon } from '@chakra-ui/react'
import { uuidv4, selectFile } from '../utils'


const TEST_LOGO = 'https://wjravptupakqkmcwjgcz.supabase.co/storage/v1/object/public/images/placeholder.png';


export default function App(props:{data:Project[]})
{
    const [uploading, setUploading] = useState(false)
    const [projData, setProjData] = useState<Project>(props.data[0]);
    const supabase = useSupabaseClient()
    const [isHover, setHover] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null)

    useEffect(() => {
        if (projData.logoUrl) downloadImage(projData.logoUrl)
      }, [projData.logoUrl])


    async function downloadImage(path:string) {
        try {
            const { data, error } = await supabase.storage
            .from('project-icons')
            .download(path)

            if (error) {
                throw error
            }

            const url = URL.createObjectURL(data)

            //@ts-ignore
            setAvatarUrl(url)
        } catch (error) {
            console.log('Error downloading image: ', error)
        }
    }
    
    // const [logoUrl, setLogoUrl] = useState(TEST_LOGO);
    const onLogoSelect = async() => {
        
        try {
            let files = await selectFile("image/*", false);

            //@ts-ignore
            const file = files
            //@ts-ignore
            const fileExt = file.name.split('.').pop()
            // const fileName = `${projData.id}_${projData.owner_uid}.jpg`
            const fileName = `${uuidv4()}.jpg`
            const filePath = `${fileName}`

            setUploading(true);
    
            let { error: uploadError } = await supabase.storage
            .from('project-icons')
            //@ts-ignore
            .upload(filePath, file, { upsert: true })
    
            if (uploadError) {
                alert('upload error: ' + JSON.stringify(uploadError));
                throw uploadError
            }
    
            // const { data } = supabase
            // .storage
            // .from('project-icons')
            // .getPublicUrl(filePath)

            const { error } = await supabase
            .from('Project')
            .update({ logoUrl: filePath })
            .eq('id', projData.id)

            if (error) {
                alert('Failed to update project url ' + JSON.stringify(uploadError));
                throw error
            }
    
            setProjData({
                ...projData,
                logoUrl: filePath
            })
        } catch(err) {

        } finally {
            setUploading(false);
        }

        // //@ts-ignore
        // setLogoUrl(URL.createObjectURL(files));
    };
    
   
    const setProjectName = async (newName:string) => {
        if (!newName || newName === projData.name){
            return
        }

        const oldName = projData.name;

        setProjData({
            ...projData,
            name: newName
        })

        const { error } = await supabase
        .from('Project')
        .update({ name: newName })
        .eq('id', projData.id)

        if (error) {
            alert('Failed to update project name')

            setProjData({
                ...projData,
                name: oldName
            })
        }
    }

    const setProjectFee = async (newFee:number) => {
        if (newFee === projData.fee){
            return
        }

        const oldFee = projData.fee;

        setProjData({
            ...projData,
            fee: newFee
        })

        const { error } = await supabase
        .from('Project')
        .update({ fee: newFee })
        .eq('id', projData.id)

        if (error) {
            alert('Failed to update project fee')

            setProjData({
                ...projData,
                fee: oldFee
            })
        }
    }

    let logoUrl = TEST_LOGO;
    if (avatarUrl){
        logoUrl = avatarUrl
    }

    return (
        <Flex dir='row'> 
           <Sidebar/>


           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} alignItems='center' height='100vh'  overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Overview'/>
                    <Box onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    <Image  cursor='pointer' borderRadius={100} width={200} height={200} src={logoUrl} />
                    
                    {uploading && ( 
                        <Flex position='absolute' borderRadius={100} top={70} backgroundColor='rgba(0,0,0,0.5)' width={200} height={200} alignItems='center' justifyContent='center'>
                            <Spinner color='white'  size='lg'/>
                        </Flex>
                    )}

                    {isHover && !uploading && (
                        <Flex onClick={() => onLogoSelect()} cursor='pointer'  position='absolute' borderRadius={100} top={70} backgroundColor='rgba(0,0,0,0.5)' width={200} height={200} alignItems='center' justifyContent='center'>
                            <Icon as={BiPlusMedical} w={7} h={7} color='white' />
                        </Flex>
                    )}

                    </Box>

                <Flex flexDir='column' gap={4} >

                    <TitleBlock title='Project name' value={projData.name} hasEdit={true} onValChanged={setProjectName} />
                    <TitleBlock title='Creator fee %' value={projData.fee.toString()} hasEdit={true} onValChanged={(val) => setProjectFee(+val)} />

                    <TitleBlock title='Blockchain' value={projData.blockchain} hasEdit={false} />
                    <TitleBlock title='Total mints' value={`${projData.mintCount}`} hasEdit={false} />
                    <TitleBlock title='Minted' value={`${projData.minted}`} hasEdit={false} />
                    <TitleBlock title='Trait count' value={`${projData.traitCount}`} hasEdit={false} />

                    <Spacer/>

                </Flex>
            </Flex>

        </Flex>
    )
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/',
    async getServerSideProps(ctx, supabase) {
        const {
            data: { user },
          } = await supabase.auth.getUser()

        console.log(user?.id)
        
        const { data } = await supabase.from('Project').select('*').eq('owner_uid', user?.id);

        return { props: { data } }
    },
})