import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { 
  Flex, Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,ModalCloseButton,
  Button,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'


export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  let router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (session){
    router.push('/app');
    return;
  }



  return (
    <div className={styles.container}>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={['google', 'discord']}
            />
          </ModalBody>
        </ModalContent>
      </Modal>



      <Head>
        <title>Tokenized</title>
        <meta name="description" content="Launch your NFT collection in minutes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="/">tokenized.so!</a>
        </h1>

        <Button onClick={onOpen} colorScheme='teal' size='lg' marginTop={10}>
          Login
        </Button>

        
      </main>

      
    </div>
  )
}
