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


export default function App()
{
    return (
        <Flex dir='row'> 
           <Sidebar/>


           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} alignItems='center' height='100vh'  overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Overview'/>

                <Image width={200} src='https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=3840' />

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