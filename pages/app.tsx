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

                    <TitleBlock title='Project name' value='Bored Ape Yacht Club' hasEdit={true} />
                    <TitleBlock title='Creator fee' value='2.5%' hasEdit={true} />


                    <TitleBlock title='Blockchain' value='Solana' hasEdit={false} />
                    <TitleBlock title='Total mints' value='10,000' hasEdit={false} />
                    <TitleBlock title='Minted' value='10,000' hasEdit={false} />
                    <TitleBlock title='Trait count' value='75' hasEdit={false} />

                    <Spacer/>

                </Flex>
            </Flex>

        </Flex>
    )
}