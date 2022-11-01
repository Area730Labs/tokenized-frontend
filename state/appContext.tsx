import { ILayer, ILayerImage } from "./layerState"
import { createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";
import { IChangeLayerNameModalProps } from "../components/modals/changeLayerNameModal";
import { IProjectMeta } from "./projectState";
import useSWR from "swr";
import { fetcher } from "../config";
import { MarketApp } from "../lib/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession } from "@supabase/auth-helpers-react";



export interface AppContextType 
{
    layerData: ILayer[],
    addLayer: (layerName: string) => void,
    removeLayer: (layerName: string) => void,
    moveLayerUp: (layerIndex: number) => void,
    moveLayerDown: (layerIndex: number) => void,
    renameLayer: (layerIndex: number, newName: string) => void,
    removeLayerImage: (layerIndex: number, imageIndex: number) => void

    // Layer name modal
    setLayerNameModalProps: (props: IChangeLayerNameModalProps|null) => void,
    layerNameModalProps: IChangeLayerNameModalProps | null,

   
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode; }) {
    const [layerData, setLayerData]= useState<ILayer[]>([]);
    const supabase = useSupabaseClient()
    const session = useSession()

    const updateData = async() => {
        const {data: { user },} = await supabase.auth.getUser()
        const { data:projectData } = await supabase.from('Project').select('*').eq('owner_uid', user?.id);
        
        if (projectData && projectData.length > 0){
            const proj = projectData[0];
            setLayerData(proj.layers)
        }
    }

    useEffect(() => {
        updateData()
    }, [])

    useEffect(() => {
        updateData()
    }, [session])

    const updateLayerData = async(newLayers: ILayer[]) => {
        const {data: { user },} = await supabase.auth.getUser()

        const { error } = await supabase
        .from('Project')
        .update({ layers: newLayers })
        .eq('owner_uid', user?.id)

        return !error
    }

    const [layerNameModalProps, setLayerNameModalProps] = useState<IChangeLayerNameModalProps|null>(null);

    const removeLayer = async (layerName: string) => {
        let newArr = [...layerData]
        newArr = newArr.filter((item) => item.layerName !== layerName)

        if (await updateLayerData(newArr)){
            setLayerData(newArr);
        } else {
            alert('Failed to update layers data')
        }
    };

    const addLayer = async (layerName: string) => {
        let exists = false;

        layerData.forEach((layer) => {
            if (layer.layerName === layerName) {
                exists = true;
            }
        })

        if (exists){
            alert('Layer with this name already exists')
            return;
        }

        const newLayers: ILayer[] = [...layerData, {
            layerName:layerName,
            images: []
        }];

        if (await updateLayerData(newLayers)){
            setLayerData(newLayers);
        } else {
            alert('Failed to update layers data')
        }
    };

    const moveLayerUp = async (layerIndex: number) => {
        let newArr = [...layerData];
        const tmp = newArr[layerIndex];
        newArr[layerIndex] = newArr[layerIndex - 1];
        newArr[layerIndex - 1] = tmp;

        if (await updateLayerData(newArr)){
            setLayerData(newArr);
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
            setLayerData(newArr);
        } else {
            alert('Failed to update layers data')
        }
    };

    const renameLayer = async (layerIndex: number, newName: string) => {
        let newArr = [...layerData];
        newArr[layerIndex].layerName = newName;

        if (await updateLayerData(newArr)){
            setLayerData(newArr);
        } else {
            alert('Failed to update layers data')
        }
    }

    const removeLayerImage = (layerIndex: number, imageIndex: number) => {
        let newArr = [...layerData];
        newArr[layerIndex].images.splice(imageIndex, 1);
        setLayerData(newArr);
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
        removeLayerImage
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