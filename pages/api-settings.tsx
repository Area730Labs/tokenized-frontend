import { 
    Box,
    Flex,
    Text,
    Button,
    Icon,
    useToast
} from '@chakra-ui/react'
import Sidebar from '../components/sidebar'
import ContentHeader from '../components/contentHeader';
import 
{ 
    BiCopy,
} from "react-icons/bi";
import { User, withPageAuth } from '@supabase/auth-helpers-nextjs'
import { Profile } from '../lib/types';

export default function ApiSettings(props:{profile:Profile}) {

    const toast = useToast();
    const id = 'copy-toast';

    const apiData = [
        {title: 'Mint nft', endpoint: 'https://api.tokenized.so/v1/mint', method: 'POST'},
        {title: 'Collection stats', endpoint: 'https://api.tokenized.so/v1/stats', method: 'POST'},
        {title: 'Close mint', endpoint: 'https://api.tokenized.so/v1/stopMint', method: 'POST'},
        {title: 'Snapshot', endpoint: 'https://api.tokenized.so/v1/snapshot', method: 'POST'},
        {title: 'Update collection', endpoint: 'https://api.tokenized.so/v1/updateCollection', method: 'POST'},
        {title: 'Update NFT', endpoint: 'https://api.tokenized.so/v1/updateNft', method: 'POST'},
    ];

    let apiViews:any = [];

    apiData.map((item: any, index:number) => {
        apiViews.push(
            <Flex gap='10px' flexDir='column' key={index}>
                <Text fontWeight='bold' fontSize={20}>{item.title}</Text>
                <Box backgroundColor='#f7f7f7' padding={2} borderRadius='5px'>
                    <Text as='span' fontWeight='bold'>{item.method}</Text> {item.endpoint}
                </Box>
            </Flex>
        )
    });

    return (
        <Flex dir='row'> 
           <Sidebar/>

           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} alignItems='center' height='100vh'  overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='API'/>


                <Flex width={600} gap={6} flexDir='column'>
                    <Box backgroundColor='#f7f7f7' padding={3} borderRadius='10px' width='auto'>
                        <Text fontWeight='bold'>Your API key:</Text>
                        <Flex flexDir='row' alignItems='center' gap={5}>
                            <Text>{props.profile.api_key}</Text>
                            <Button
                            onClick={() =>
                                {
                                    //@ts-ignore
                                    navigator.clipboard.writeText(props.profile.api_key);
                                    if (!toast.isActive(id)){
                                        toast({
                                            id,
                                            title: 'API key copied',
                                            status: 'success',
                                            duration: 3000,
                                            isClosable: true,
                                          })
                                    }
                                    }
                                }
                            size='sm' leftIcon={<Icon as={BiCopy} w={5} h={5} color='#ffffff' />} colorScheme='blue' variant='solid'>
                                Copy
                            </Button>
                        </Flex>
                    </Box>

                    {apiViews}
                </Flex>

            </Flex>
        </Flex>
    );
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/',
    async getServerSideProps(ctx, supabase) {
        const {
            data: { user },
          } = await supabase.auth.getUser()

        
        const { data } = await supabase.from('Profile').select('*').eq('owner_uid', user?.id);
        
        //@ts-ignore
        return { props: { profile: data[0] } }
    },
})