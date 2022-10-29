import { 
    Box,
    Flex,
    IconButton,
    Spacer,
    Text,
    Input
} from '@chakra-ui/react'
import 
{ 
    BiPencil,
    BiCheck
} from "react-icons/bi";
import { Icon } from '@chakra-ui/react'
import { useState } from 'react';

export default function TitleBlock(props: {title: string, value: string, hasEdit: boolean, onValChanged?:(val:string)=>void}) {

    const [val, setVal] = useState(props.value);
    const [isEdit, setIsEdit] = useState(false);

    const onEdit = () => {
        setIsEdit(true);
    };

    const onApply = () => {
        if (!val.trim()){
            return;
        }

        setIsEdit(false);

        if (props.onValChanged){
            props.onValChanged(val)
        }
    }

    const handleChange = (event:any) => setVal(event.target.value)

    const fontSize = 18;
    return (
        <Flex flexDir='row' gap={5} width='500px' backgroundColor='#f7f7f7' borderRadius={10} padding='12px' alignItems='center'>
            <Text fontWeight='bold' fontSize={fontSize} width={130}>{props.title}:</Text>
            {!isEdit && <Text fontSize={fontSize}>{val}</Text>}
            {isEdit && <Input
                value={val}
                onChange={handleChange}
                placeholder='Enter value'
                width={250}
                size='sm'
            />}
            <Spacer/>
            {props.hasEdit && !isEdit && <Icon onClick={onEdit} as={BiPencil} w={7} h={7} color='#4d4b4b' marginLeft='20px' cursor='pointer' />}
            {isEdit && <IconButton onClick={onApply} size={'sm'} aria-label='Search database' icon={<Icon as={BiCheck} w={7} h={7} color='green' cursor='pointer' />} /> }
        </Flex>
    );  
}