import { ILayer, ILayerImage } from "./layerState"
import { createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";
import { IChangeLayerNameModalProps } from "../components/modals/changeLayerNameModal";
import { IProjectMeta } from "./projectState";

export interface AppContextType 
{
    layerData: ILayer[],
    addLayer: (layerName: string) => boolean,
    removeLayer: (layerName: string) => boolean,
    moveLayerUp: (layerIndex: number) => void,
    moveLayerDown: (layerIndex: number) => void,
    renameLayer: (layerIndex: number, newName: string) => void

    // Layer name modal
    setLayerNameModalProps: (props: IChangeLayerNameModalProps) => void,
    layerNameModalProps: IChangeLayerNameModalProps | null,

    projectMeta: IProjectMeta
    setProjectName: (projName: string) => void,
    setProjectFee: (projFee: number) => void
}



const layerDataDemo: ILayer[] = [
    {layerName: 'Background', images: [
        {
            imageName: 'Bg_1.jpg',
            url: 'https://img.seadn.io/files/84b7e2e55e4a354a1e8dda5dea15d5ca.png?fit=max&w=2000',
            rarity: 100
        },
    ]},  
];


const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode; }) {
    const [layerData, setLayerData]= useState<ILayer[]>(layerDataDemo);
    const [layerNameModalProps, setLayerNameModalProps] = useState<IChangeLayerNameModalProps|null>(null);
    const [projectMeta, setProjectMeta] = useState<IProjectMeta>({
        projectName: 'Demo project', 
        projectFee: 2.5,
        blockchain: 'Solana',
        totalMints: 10_000,
        minted: 10_000,
        traitCount: 75
    });
    
    const removeLayer = (layerName: string):boolean => {
        let exists = false;

        layerData.forEach((layer) => {
            if (layer.layerName === layerName) {
                exists = true;
            }
        })

        if (!exists){
            return false;
        }

        setLayerData((prevState) => prevState.filter((item) => item.layerName !== layerName));

        return true;
    };

    const addLayer = (layerName: string):boolean => {
        let exists = false;

        layerData.forEach((layer) => {
            if (layer.layerName === layerName) {
                exists = true;
            }
        })

        if (exists){
            return false;
        }

        const newLayers: ILayer[] = [...layerData, {
            layerName:layerName,
            images: []
        }];

        setLayerData(newLayers);

        return true;
    };

    const moveLayerUp = (layerIndex: number) => {
        let newArr = [...layerData];
        const tmp = newArr[layerIndex];
        newArr[layerIndex] = newArr[layerIndex - 1];
        newArr[layerIndex - 1] = tmp;

        setLayerData(newArr);
    };

    const moveLayerDown = (layerIndex: number) => {
        let newArr = [...layerData];
        const tmp = newArr[layerIndex];
        newArr[layerIndex] = newArr[layerIndex + 1];
        newArr[layerIndex + 1] = tmp;

        setLayerData(newArr);
    };

    const renameLayer = (layerIndex: number, newName: string) => {
        let newArr = [...layerData];
        newArr[layerIndex].layerName = newName;
        setLayerData(newArr);
    }

    const setProjectName = (projName: string) => {
        let newMeta: IProjectMeta = {...projectMeta};
        newMeta.projectName = projName;

        setProjectMeta(newMeta);
    }

    const setProjectFee = (projFee: number) => {
        let newMeta: IProjectMeta = {...projectMeta};
        newMeta.projectFee = projFee;

        setProjectMeta(newMeta);
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
        projectMeta,
        setProjectName,
        setProjectFee
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