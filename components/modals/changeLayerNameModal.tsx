import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Button,
    Input,
    useDisclosure
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../state/appContext'


export interface IChangeLayerNameModalProps {
    createMode: boolean, 
    onOkAction: (nameVal:string) => void
    currentName?: string,
}

export default function ChangeLayerNameModal() {
    const {layerNameModalProps, setLayerNameModalProps} = useAppContext()

    const initialRef = useRef(null)
    const [value, setValue] = useState('')
    const handleChange = (event:any) => setValue(event.target.value)
    const {isOpen, onOpen, onClose} =  useDisclosure()

    useEffect(() => {
        if (!isOpen) {
            setValue('')
        }
    }, [isOpen]);

    useEffect(() => {
        if (layerNameModalProps) {
            if (!layerNameModalProps.createMode){
                if (layerNameModalProps.currentName){
                    setValue(layerNameModalProps.currentName)
                }
            }
            onOpen()
        }
    }, [layerNameModalProps])

    const onOk = () => {
        if (value.trim()) {
            layerNameModalProps?.onOkAction(value)
            onClose()
        }
    };

    const onCloseDialog = () => {
        setLayerNameModalProps(null);
        onClose()
    }


    const title = layerNameModalProps?.createMode ? 'Create layer': 'Rename layer'
    const okActionLabel = layerNameModalProps?.createMode ? 'Create': 'Rename'

    return (
        <Modal
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={onCloseDialog}
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <FormControl>
                <FormLabel>Layer name</FormLabel>
                <Input ref={initialRef} value={value} onChange={handleChange} placeholder='Enter layer name' />
                </FormControl>

            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onOk}>
                {okActionLabel}
                </Button>
                <Button onClick={onCloseDialog}>Cancel</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}