export interface Stock {
    sizes: number[];
    quantities: {
        [key: string]: number
    }
}

export interface RemainingStock {
  original: number;
  left: number;
  cuts: number[];
}

export interface CuttingOptions {
    totalMaterialLeft: string;
    remainingStock: RemainingStock[],
    cutMap: {
        [key: string]: number[];
    }
}

/*
[
  {
    "totalMaterialLeft": 1120, 
    "remainingStock": {
      "1000": 175,
      "2000": 547,
      "3500a": 927,
      "3500b": 0
    },
    "cutMap": {
      "1000": [325, 450],
      "2000": [1100],
      "3500a": [502],
      "3500b": []
    }
  }
]
*/