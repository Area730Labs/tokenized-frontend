import { 
    Box,
    Flex,
    Text,
    Button,
    Icon
} from '@chakra-ui/react'
import Sidebar from '../components/sidebar'
import ContentHeader from '../components/contentHeader';



export default function NftList() {


    return (
        <Flex dir='row'> 
           <Sidebar/>

           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} alignItems='center' height='100vh'  overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='NFTs'/>



            </Flex>
        </Flex>
    );
}