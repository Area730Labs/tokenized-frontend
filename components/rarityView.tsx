import { 
    Flex,
    Text,
    Icon,
    Input,
    useToast,
    Spinner
} from "@chakra-ui/react"
import { useState } from "react";
import 
{ 
    BiPencil,
    BiCheck,
    BiX,
} from "react-icons/bi";

export type Props = {
    rarity:number,
}

export default function RarityView(props:Props){
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [value, setValue] = useState(props.rarity.toString())
    const [hasError, setHasError] = useState<boolean>(false)
    const toast = useToast()
    const [isUpading, setIsUpating] = useState<boolean>(false)


    const handleChange = (event:any) => {
        const rawVal = event.target.value
        const val = parseFloat(rawVal)

        if (isNaN(val) || val < 0 || val > 100){
            setHasError(true)
        } else {
            setHasError(false)
        }

        setValue(rawVal)
    }

    const onEdit = async () => {
        setHasError(false)
        setValue(props.rarity.toString())
        setIsEdit(true)
    }

    const onSave = async () => {
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

        if (props.rarity === parseFloat(value)){
            setIsEdit(false)
            return
        }

        // setIsUpating(true)

        setIsEdit(false)
    }

    const onCancel = async () => {
        setIsEdit(false)
    }

    return (
        <>
            <Flex  flexDir='row' gap={2} backgroundColor='#f1f1f1' padding='5px' paddingLeft='8px' paddingRight='8px' borderRadius='5px' alignItems='center'>
                Rarity %:

                {!isEdit && (
                    <>
                         <Text>{props.rarity}</Text>
                         <Flex onClick={onEdit} alignItems='center' justifyContent='center' backgroundColor='#ffffff' padding='5px' borderRadius='5px' cursor='pointer' _hover={{backgroundColor: '#cccccc'}}>
                            <Icon as={BiPencil} w={4} h={4} color='black' />
                        </Flex>
                        
                    </>
                )}

                {isEdit && (
                    <>
                        <Input isDisabled={isUpading} placeholder='...' isInvalid={hasError} type="number"  height='30px' value={value} onChange={handleChange} width='60px'  focusBorderColor={hasError?'#d42e22':'#49b9de'} />

                        {!isUpading && (
                            <>
                                <Flex onClick={onSave} alignItems='center' justifyContent='center' backgroundColor='#ffffff' padding='5px' borderRadius='5px' cursor='pointer' _hover={{backgroundColor: '#cccccc'}}>
                                        <Icon as={BiCheck} w={4} h={4} color='green' />
                                </Flex>

                                <Flex onClick={onCancel} alignItems='center' justifyContent='center' backgroundColor='#ffffff' padding='5px' borderRadius='5px' cursor='pointer' _hover={{backgroundColor: '#cccccc'}}>
                                    <Icon as={BiX} w={4} h={4} color='red' />
                                </Flex>
                            </>
                        )}

                        {isUpading && (<Spinner size='sm' color='blue.500' />)}
                    </>
                )}
               
            </Flex>
        </>
    )
}