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
import { AiFillStar } from "react-icons/ai";
import { Icon } from '@chakra-ui/react'
import { useAppContext } from '../state/appContext';
import { useState } from 'react';
import { User, withPageAuth } from '@supabase/auth-helpers-nextjs'
import { MarketApp } from '../lib/types';


function truncate(input: string) {
    const l = 125;
    if (input.length > l) {
       return input.substring(0, l) + '...';
    }
    return input;
 };

export default function Apps(props:{data:any}) {
    const marketApps = props.data;
    const [searchVal, setSearchVal] = useState('')
    const handleChange = (event:any) => setSearchVal(event.target.value)

    let appViews:any = [];

    marketApps.map((item: MarketApp, index: number) => {
        if (searchVal && !item.name.toLowerCase().includes(searchVal.toLowerCase())){
            return;
        }

        appViews.push(
                <GridItem minW={440} maxW={550} key={index} w='100%' border='1px solid #ededeb' borderRadius='6px' display='flex' padding='10px' cursor='pointer' gap='20px'>
                    <Image height='120px' borderRadius='5px' src={item.iconUrl} />
                    
                    <Flex gap='5px' flexDir='column' width='100%'>
                        
                        <Flex flexDir='row' >
                            <Text fontWeight='bold' fontSize='20px'>{item.name}</Text>
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
                    
                    // children={<Icon as={BiSearch} w={6} h={6} color='#4a4848'/>}
                    />
                    <Input type='text' value={searchVal} onChange={handleChange} placeholder='Search' autoFocus />
                </InputGroup>

                <Grid templateColumns='repeat(2, 1fr)' gap={6} >
                    {appViews}
                </Grid>
               
            </Flex>
        </Flex>
    );
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/',
    async getServerSideProps(ctx, supabase) {
      const { data } = await supabase.from('MarketApp').select('*')
      return { props: { data } }
    },
})