import { 
    Box,
    Flex,
    Spacer,
    Text
} from '@chakra-ui/react'

export default function HeaderBlock() 
{
    return (
        <Flex alignItems='center' justifyContent='center'>
            <Text fontWeight='bold' fontSize='20px' textTransform='uppercase'>tokenized</Text>
        </Flex>
    )
}