import { ILayer, ILayerImage } from "./layerState"
import { createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";
import { IChangeLayerNameModalProps } from "../components/modals/changeLayerNameModal";
import { IProjectMeta } from "./projectState";
import useSWR from "swr";
import { fetcher } from "../config";
import { MarketApp } from "../lib/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession } from "@supabase/auth-helpers-react";
import { uuidv4 } from "../utils";
import { UploadingImage } from "../pages/layers";
import { AddLayerImageArgs } from "../pages/api/addLayerImage";
import { RemoveLayerImageArgs } from "../pages/api/removeLayerImage";
import { RemoveLayerArgs } from "../pages/api/removeLayer";
import { SetImageRarityArgs } from "../pages/api/setImageRarity";


export interface AppContextType 
{
    layerData: ILayer[],
    addLayer: (layerName: string) => Promise<boolean>,
    removeLayer: (layerId: string) => Promise<boolean>,
    moveLayerUp: (layerIndex: number) => void,
    moveLayerDown: (layerIndex: number) => void,
    renameLayer: (layerIndex: number, newName: string) => Promise<boolean>,
    removeLayerImage: (layerUid:string, imageUid: string) => Promise<boolean>

    // Layer name modal
    setLayerNameModalProps: (props: IChangeLayerNameModalProps|null) => void,
    layerNameModalProps: IChangeLayerNameModalProps | null,

    isPublished: boolean,
    addLayerImage: (uploadImage:UploadingImage, layerUid:string, onOk:()=>void) => Promise<boolean>,
    updateLayerImage: (imageUid:string, rarity:number) => Promise<boolean>
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode; }) {
    const [layerData, setLayerData]= useState<ILayer[]>([]);
    const [published, setPublished] = useState(false)
    const [projectId, setProjectId] = useState(-1)

    const supabase = useSupabaseClient()
    const session = useSession()


    const setLatestLayerData = async() => {
        try {
            const data = await getLayerData()
            if (data) {
                setLayerData(data)
            } else {
                setLayerData([])
            }
        } catch (err) {
            setLayerData([])
        }   
    }

    const updateData = async() => {
        const {data: { user },} = await supabase.auth.getUser()
        const { data:projectData } = await supabase.from('Project').select('*').eq('owner_uid', user?.id);
        
        if (projectData && projectData.length > 0){
            const proj = projectData[0];
            await setLatestLayerData()
            setProjectId(proj.id)
        }
    }


    useEffect(() => {
        if (projectId < 0) {
            return;
        }

        const subChannel = supabase
        .channel('public:Project')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'Project', filter:`id=${projectId}` }, payload => {
          console.log('Change received!', payload)
        })
        .subscribe()

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
              if (event === "SIGNED_OUT") {
                setProjectId(-1)
              }
            }
          );
      
          return () => {
            authListener.subscription.unsubscribe()
            supabase.removeAllChannels();
          };
    }, [projectId])

    useEffect(() => {
        updateData()
    }, [])

    useEffect(() => {
        updateData()
    }, [session])

    const updateLayerData = async(newLayers: ILayer[]) => {
        const {data: { user },} = await supabase.auth.getUser()

        for(let i = 0; i < newLayers.length; ++i){
            newLayers[i].images = []
        }

        const { error } = await supabase
        .from('Project')
        .update({ layers: newLayers })
        .eq('owner_uid', user?.id)

        return !error
    }

    const [layerNameModalProps, setLayerNameModalProps] = useState<IChangeLayerNameModalProps|null>(null);

    const removeLayer = async (layerId: string):Promise<boolean> => {
        const reqData: RemoveLayerArgs = {
            layerId
        }

        const res = await fetch('/api/removeLayer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
        })

        if (res.status !== 200){
            return false;
        }

        await setLatestLayerData()

        return true
    };

    const addLayer = async (layerName: string):Promise<boolean> => {
        let exists = layerData.findIndex(x => x.layerName === layerName) >= 0;

        if (exists){
            return false;
        }

        const newLayers: ILayer[] = [...layerData, {
            layerName:layerName,
            images: [],
            uid: uuidv4()
        }];

        if (await updateLayerData(newLayers)){
            await setLatestLayerData()
            return true;
        } else {
            alert('Failed to update layers data')
            return false
        }
    };

    const moveLayerUp = async (layerIndex: number) => {
        let newArr = [...layerData];
        const tmp = newArr[layerIndex];
        newArr[layerIndex] = newArr[layerIndex - 1];
        newArr[layerIndex - 1] = tmp;

        if (await updateLayerData(newArr)){
            await setLatestLayerData()
        } else {
            alert('Failed to update layers data')
        }
    };

    const moveLayerDown = async (layerIndex: number) => {
        let newArr = [...layerData];
        const tmp = newArr[layerIndex];
        newArr[layerIndex] = newArr[layerIndex + 1];
        newArr[layerIndex + 1] = tmp;

        if (await updateLayerData(newArr)){
            await setLatestLayerData()
        } else {
            alert('Failed to update layers data')
        }
    };

    const renameLayer = async (layerIndex: number, newName: string):Promise<boolean> => {
        const nameExists = layerData.findIndex(x => x.layerName === newName) >= 0;
        if (nameExists) {
            return false;
        }

        let newArr = [...layerData];
        newArr[layerIndex].layerName = newName;

        if (await updateLayerData(newArr)){
            await setLatestLayerData()
            return true
        } else {
            alert('Failed to update layers data')
            return false
        }
    }

    const getLayerData = async():Promise<ILayer[]> => {
        const res = await fetch('/api/getLayerData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
        })

        return await res.json()
    }

    const addLayerImage = async(uploadImage:UploadingImage, layerUid:string, onOk:()=>void):Promise<boolean> => {

        //replace url from local to remote
        const { data:{publicUrl} } = supabase
        .storage
        .from('layer-images')
        .getPublicUrl(uploadImage.image.fileUid)

        uploadImage.image.url = publicUrl

        const reqData:AddLayerImageArgs = {
            layerId: layerUid,
            image: uploadImage.image
        }

        const res = await fetch('/api/addLayerImage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
        })

        if (res.status !== 200){
            return false;
        }

        onOk()

        await setLatestLayerData()

        return true;
    }

    const removeLayerImage = async(layerUid:string, imageUid: string):Promise<boolean> => {
        const reqData:RemoveLayerImageArgs = {
            layerId: layerUid,
            imageId: imageUid
        }

        const res = await fetch('/api/removeLayerImage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
        })

        if (res.status !== 200){
            return false;
        }

        await setLatestLayerData()
        

        return true
    }

    const updateLayerImage = async(imageUid:string, rarity:number): Promise<boolean> => {
        const reqData:SetImageRarityArgs = {
            imageUid,
            rarity
        }

        const res = await fetch('/api/setImageRarity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
        })

        if (res.status !== 200){
            return false;
        }

        await setLatestLayerData()
        
        return true
    }

    
   
    const ctxVal:AppContextType = {
        layerData,
        addLayer,
        removeLayer,
        moveLayerUp,
        moveLayerDown,
        layerNameModalProps,
        setLayerNameModalProps,
        renameLayer, 
        isPublished: published,
        addLayerImage,
        removeLayerImage,
        updateLayerImage
    } ;

    return (
        <AppContext.Provider value={ctxVal}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {

    const app = useContext(AppContext)

    if (!app) {
        console.error(
            "useAppContext: `app` is undefined. Seems you forgot to wrap your app in ` < AppProvider /> `",
        )
    }

    return app;
}