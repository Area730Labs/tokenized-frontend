
export interface ILayerImage {
    imageName: string,
    fileUid:string,
    url: string,
    rarity: number,
}

export interface ILayer {
    uid: string,
    layerName: string,
    images: ILayerImage[],
}