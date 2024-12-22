import type { Stock, CuttingOptions } from "../types/types"

export const stock: Stock = {
    sizes: [],
    quantities: {}
}

export const defaultCutOptions: CuttingOptions[] = [{
    totalMaterialLeft: 0,
    remainingStock: [],
    cutMap: {}
}]

export const pieces: number[] = [];