import { 
    Flex,
    Spacer,
    Divider
} from '@chakra-ui/react'
import SidebarButton from './sidebarButton'
import 
{ 
    BiBarChartAlt,
    BiCategory,
    BiListUl,
    BiCodeAlt,
    BiPencil,
    BiLayer,
    BiLogOut,
    BiImages
} from "react-icons/bi";
import HeaderBlock from './headerBlock';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'



export default function Sidebar()
{
    const supabase = useSupabaseClient()
    let router= useRouter()
    const session = useSession()

    

    const data = [
        {
            label: 'Overview',
            icon: BiListUl,
            url: '/app'
        },
        {
            label: 'Analytics',
            icon: BiBarChartAlt,
            url: '/analytics'
        },
        {
            label: 'Layers',
            icon: BiLayer,
            url: '/layers'
        },
        {
            label: 'NFTs',
            icon: BiImages,
            url: '/nft-list'
        },
        {
            label: 'Customize',
            icon: BiPencil,
            url: '/customize'
        },
        {
            label: 'Apps',
            icon: BiCategory,
            url: '/apps'
        },
        {
            label: 'API',
            icon: BiCodeAlt,
            url: '/api-settings'
        }
    ]

    const signOut = async() => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error(`Failed to sign out: error ${error}`)
        } else {
            router.push('/')
        }
    }

    return (
        <Flex width='230px' height='100vh' backgroundColor='#fafafa' flexDir='column' padding='10px' gap='10px'>
            <HeaderBlock/>
            <>
                {data.map((item, index) => {
                    return <SidebarButton label={item.label} icon={item.icon} key={index} url={item.url} />
                })}
            </>

            <Spacer/>
            <Divider/>
            <SidebarButton onClick={signOut} label='Sign out' key={9999} icon={BiLogOut} url='/'  />
        </Flex>
    )
}