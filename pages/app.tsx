import { 
    Box,
    Flex,
    Image,
    Spacer,
    Text
} from '@chakra-ui/react'
import Sidebar from '../components/sidebar'
import ContentHeader from '../components/contentHeader'
import TitleBlock from '../components/titleBlock'
import { useState } from 'react'
import { useAppContext } from '../state/appContext'

function selectFile (contentType:any, multiple:any){
    return new Promise(resolve => {
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = multiple;
        input.accept = contentType;

        input.onchange = _ => {
            //@ts-ignore
            let files = Array.from(input.files);
            if (multiple)
                resolve(files);
            else
                resolve(files[0]);
        };

        input.click();
    });
}

const TEST_LOGO = 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=3840';


export default function App()
{
    const {projectMeta, setProjectName, setProjectFee} = useAppContext()

    const [logoUrl, setLogoUrl] = useState(TEST_LOGO);
    const onLogoSelect = async() => {
        let files = await selectFile("image/*", false);

        //@ts-ignore
        setLogoUrl(URL.createObjectURL(files));
    };

    return (
        <Flex dir='row'> 
           <Sidebar/>


           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} alignItems='center' height='100vh'  overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Overview'/>
                    <Image onClick={() => onLogoSelect()} cursor='pointer' borderRadius={100} width={200} height={200} src={logoUrl} />

                <Flex flexDir='column' gap={4} >

                    <TitleBlock title='Project name' value={projectMeta.projectName} hasEdit={true} onValChanged={setProjectName} />
                    <TitleBlock title='Creator fee' value={`${projectMeta.projectFee}%`} hasEdit={true} onValChanged={(val) => setProjectFee(+val)} />

                    <TitleBlock title='Blockchain' value={projectMeta.blockchain} hasEdit={false} />
                    <TitleBlock title='Total mints' value={`${projectMeta.totalMints}`} hasEdit={false} />
                    <TitleBlock title='Minted' value={`${projectMeta.minted}`} hasEdit={false} />
                    <TitleBlock title='Trait count' value={`${projectMeta.traitCount}`} hasEdit={false} />

                    <Spacer/>

                </Flex>
            </Flex>

        </Flex>
    )
}