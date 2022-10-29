
export interface ILayerImage {
    imageName: string,
    url: string,
    rarity: number
}

export interface ILayer {
    layerName: string;
    images: ILayerImage[];
}