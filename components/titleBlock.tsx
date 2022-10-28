import { 
    Box,
    Flex,
    Image,
    Spacer,
    Text
} from '@chakra-ui/react'
import 
{ 
    BiPencil
} from "react-icons/bi";
import { Icon } from '@chakra-ui/react'


export default function TitleBlock(props: {title: string, value: string, hasEdit: boolean}) {
    const fontSize = 18;
    return (
        <Flex flexDir='row' gap={5} width='500px' backgroundColor='#f7f7f7' borderRadius={10} padding='12px'>
            <Text fontWeight='bold' fontSize={fontSize} width={130}>{props.title}:</Text>
            <Text fontSize={fontSize}>{props.value}</Text>
            <Spacer/>
            {props.hasEdit && <Icon as={BiPencil} w={7} h={7} color='#4d4b4b' marginLeft='20px' cursor='pointer' />}
        </Flex>
    );
}