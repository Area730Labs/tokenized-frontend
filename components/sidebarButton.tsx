import { 
    Box,
    Flex,
    Spacer,
    Text,
    Button
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Icon } from '@chakra-ui/react'


export default function SidebarButton(props: { key: any, label: string, icon: any, url: string})
{
    const router = useRouter();

    const clickHandler = () => {
        router.replace(props.url);
    };

    const isOpened = router.pathname === props.url;
    const bgColor = isOpened ? '#f0f0f0': 'none';

    return (
        <Flex onClick={clickHandler} backgroundColor={bgColor} alignItems='center' padding='12px' gap='10px' _hover={{backgroundColor: '#f0f0f0'}} borderRadius='5px' cursor='pointer'>
            <Icon as={props.icon} w={6} h={6} color='#4d4b4b' marginLeft='20px' />
            {props.label}
        </Flex>
    )
}