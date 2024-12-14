import type { Stock, CuttingOptions } from "../types/types"

export const stock: Stock = {
    sizes: [1000,2000],
    quantities: {
        1000: 1,
        2000: 2
    }
}

export const defaultCutOptions: CuttingOptions[] = [{
    totalMaterialLeft: '0',
    remainingStock: [],
    cutMap: {}
}]

export const pieces: number[] = [
    100,
    200,
    300,
    750,
    1050,
    // 1900,
    // 500
]