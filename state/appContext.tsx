import { ILayer, ILayerImage } from "./layerState"
import { createContext, ReactNode, useContext, useState, useMemo, useEffect} from "react";



export interface AppContextType 
{
    layerData: ILayer[],
    addLayer: (layerName: string) => boolean,
    removeLayer: (layerName: string) => boolean,
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

    const ctxVal:AppContextType = {
        layerData,
        addLayer,
        removeLayer
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