import { useState } from "react"
import { 
    Flex,
    Text,
    Icon,
    Input,
    useToast,
    Spinner
} from "@chakra-ui/react"
import 
{ 
    BiPencil,
    BiCheck,
    BiX,
} from "react-icons/bi";



export type Props = {
    fieldValue:string,
    onUpdate:(newValue:string) => Promise<boolean>,
    validateValue: (newValue:string) => boolean,
    inputType?:string
}

export default function FieldWithRename(props:Props) {
    const [isUpdating, setIsUpating] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [hasError, setHasError] = useState<boolean>(false)
    const [value, setValue] = useState<string>(props.fieldValue)
    const toast = useToast()

    const handleChange = (event:any) => {
        const newVal = event.target.value

        setHasError(!props.validateValue(newVal))
        setValue(newVal)
    }

    const onEdit = async() => {
        setHasError(false)
        setValue(props.fieldValue)
        setIsEdit(true)
    }

    const onSave = async() => {
        if (hasError) {
            toast({
                title: 'Wrong value',
                status: 'error',
                position: 'bottom',
                duration: 2200,
                isClosable: true,
              })
            return
        }

        if (value === props.fieldValue){
            setIsEdit(false)
            return
        }

        setIsUpating(true)
        if (!await props.onUpdate(value)){
            toast({
                title: 'Failed to update value',
                status: 'error',
                position: 'bottom',
                duration: 2200,
                isClosable: true,
            })
        }

        setIsUpating(false)
        setIsEdit(false)
    }

    const onCancel = async() => {
        setIsEdit(false)
    }

    let inputType = 'text'
    if (props.inputType){
        inputType = props.inputType
    }

    return (
        <Flex flexDir='row' alignItems='center' gap='10px'>
            {!isEdit && (
                <>
                    <Text >{props.fieldValue}</Text>

                    <Flex onClick={onEdit} alignItems='center' justifyContent='center' backgroundColor='#ffffff' padding='5px' borderRadius='5px' cursor='pointer' _hover={{backgroundColor: '#cccccc'}}>
                        <Icon as={BiPencil} w={4} h={4} color='black' />
                    </Flex>
                    
                </>
            )}

            {isEdit && (
                <>
                    <Input isDisabled={isUpdating} placeholder='...' isInvalid={hasError} type={inputType}  height='30px' value={value} onChange={handleChange}   focusBorderColor={hasError?'#d42e22':'#49b9de'} />

                    {!isUpdating && (
                        <>
                            <Flex onClick={onSave} alignItems='center' justifyContent='center' backgroundColor='#ffffff' padding='5px' borderRadius='5px' cursor='pointer' _hover={{backgroundColor: '#cccccc'}}>
                                    <Icon as={BiCheck} w={4} h={4} color='green' />
                            </Flex>

                            <Flex onClick={onCancel} alignItems='center' justifyContent='center' backgroundColor='#ffffff' padding='5px' borderRadius='5px' cursor='pointer' _hover={{backgroundColor: '#cccccc'}}>
                                <Icon as={BiX} w={4} h={4} color='red' />
                            </Flex>
                        </>
                    )}

                    {isUpdating && (<Spinner size='sm' color='blue.500' />)}
                </>
            )}
        </Flex>
    )
}