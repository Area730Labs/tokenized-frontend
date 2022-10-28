import { 
    Text,
    Flex,
    Grid,
    GridItem,
    Image,
    Spacer
} from '@chakra-ui/react'
import Sidebar from '../components/sidebar'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import ContentHeader from '../components/contentHeader';
import 
{ 
    BiSearch,
    BiStar,
} from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { Icon } from '@chakra-ui/react'

function truncate(input: string) {
    const l = 125;
    if (input.length > l) {
       return input.substring(0, l) + '...';
    }
    return input;
 };

export default function Apps() {
    const appData = [
        {
            appName: 'Staking',
            rating: 4.5,
            ratingCount: 355,
            description: 'Advanced staking platform that supports multipliers based on traits, withdrawal tax, multiple NFTs in one transaction and more',
            icon: 'https://i.pinimg.com/474x/f6/ef/18/f6ef181390f995b10bc463e9a566f046.jpg'
        },
        {
            appName: 'Discord gating bot',
            rating: 4.8,
            ratingCount: 877,
            description: 'Discord bot that gives NFT holders special role for exclusive access to rooms',
            icon: '/images/verify.png'
        },
        {
            appName: 'Snapshots/airdrops',
            rating: 4.4,
            ratingCount: 542,
            description: 'An app that allows you to take snapshots using filters and do airdrops',
            icon: '/images/airdrop.png'
        },
        {
            appName: 'Whitelists',
            rating: 4.9,
            ratingCount: 679,
            description: 'Manage whitelists - set custom requirements like social media logins, minimum tokens in wallet or NFTs',
            icon: '/images/whitelist.png'
        },
        {
            appName: 'Rarity bot',
            rating: 4.6,
            ratingCount: 188,
            description: 'Discord bot that allows users to check the rarity of their NFT',
            icon: '/images/rarity.png'
        },
        {
            appName: 'Sales bot',
            rating: 4.7,
            ratingCount: 951,
            description: 'Twitter/Discord bot that notifies your community when a sale happens on secondary marketplace',
            icon: '/images/sales.png'
        },
        {
            appName: 'Listing bot',
            rating: 4.6,
            ratingCount: 129,
            description: 'Discord bot that notifies your community when your NFT is listed on secondary marketplace',
            icon: '/images/sales.png'
        },
        
    ];

    let appViews:any = [];

    appData.map((item: any, index: number) => {
        appViews.push(
                <GridItem minW={440} maxW={550} key={index} w='100%' border='1px solid #ededeb' borderRadius='6px' display='flex' padding='10px' cursor='pointer' gap='20px'>
                    <Image height='120px' borderRadius='5px' src={item.icon} />
                    
                    <Flex gap='5px' flexDir='column' width='100%'>
                        
                        <Flex flexDir='row' >
                            <Text fontWeight='bold' fontSize='20px'>{item.appName}</Text>
                            <Spacer/>
                            <Flex flexDir='row' gap='5px' alignItems='center'>
                                <Icon as={AiFillStar} w={6} h={6} color='#ffe600'/>
                                <Text fontSize='14px' fontWeight='bold'>{item.rating}</Text>
                                <Text fontSize='14px'>({item.ratingCount})</Text>
                            </Flex>
                        </Flex>

                        <Text>
                            {item.description}
                        </Text>

                    </Flex>
                </GridItem>
        );
    });



    return (
        <Flex dir='row'> 
           <Sidebar/>

           <Flex padding='20px' flexDir='column' flexGrow={1} gap={5} alignItems='center' height='100vh'  overflowY='scroll' overflowX='hidden'>
                <ContentHeader title='Apps'/>


                <InputGroup maxW={850}>
                    <InputLeftElement
                    pointerEvents='none'
                    children={<Icon as={BiSearch} w={6} h={6} color='#4a4848'/>}
                    />
                    <Input type='text' placeholder='Search' />
                </InputGroup>

                <Grid templateColumns='repeat(2, 1fr)' gap={6} >
                    {appViews}
                </Grid>
               
            </Flex>
        </Flex>
    );
}