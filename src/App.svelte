<script lang="ts">
  import type {Stock, CuttingOptions} from "./types/types"
  import { optimalCuts } from "./utils/helper-functions";
  import {stock as s, defaultCutOptions, pieces as p} from "./utils/default-data";
  
  const stock: Stock = $state(s);
  const pieces: number[] = $state(p);
  let cuttingOptions: CuttingOptions[] = $state(defaultCutOptions);
  let pieceToAdd: number | undefined = $state();
  let stockSizeToAdd: number | undefined = $state();
  let stockSwitch: boolean = $state(false);
  let piecesSwitch: boolean = $state(false);

  const addPiece = () => {
    pieceToAdd? pieces.push(pieceToAdd): '';
    pieceToAdd = undefined;
  }

  const removePiece = (piece: number) => {
    const index = pieces.findIndex(p => p === piece);
    pieces.splice(index, 1);
  }

  const addStockPiece = () => {
    // check value is not falsy
    if(stockSizeToAdd) {

      // only add size if it's not already in the stock
      if(!stock.sizes.includes(stockSizeToAdd)) {
        stock.sizes.push(stockSizeToAdd);
        stock.quantities[stockSizeToAdd] = 1;
      } else {
        stock.quantities[stockSizeToAdd]++;
      }
    }
    stockSizeToAdd = undefined;
  }

  const removeStockPiece = (piece: number) => {
    const index = stock.sizes.findIndex(p => p === piece);
    stock.sizes.splice(index, 1);
    delete stock.quantities[piece];
  }

  const increaseStockPiece = (piece: number) => {
    stock.quantities[piece] += 1;
  }

  const decreaseStockPiece = (piece: number) => {
    if(stock.quantities[piece] > 1) {
      stock.quantities[piece] -= 1;
    } else {
      removeStockPiece(piece);
    }
  }

  const calculateCuts = () => {
    if(pieces.length > 0 && stock.sizes.length > 0) {
      cuttingOptions = optimalCuts(stock, pieces);
      console.log($state.snapshot(cuttingOptions));
      // console.log(cuttingOptions[0]);
    }
  }

</script>

<main>
  <div class="wrapper">
    <h1>Wood Cutter Calculator</h1>

    <!-- Stock -->
    <div class="box stock">
      <button class="fold-btn" onclick={() => stockSwitch = !stockSwitch}><h2>Stock</h2></button>
      
      <div class={stockSwitch? "display-block": "display-none"}>
        <div class="box-top">
          <input bind:value={stockSizeToAdd} type="number" placeholder="Size (mm)">
          <button onclick={addStockPiece}>Add</button>
        </div>
        <div class="box-bottom">
          {#each stock.sizes as size}
          <div class="box-items">
            <div class="stock-details">
              <span>{size}</span>
              <span>{stock.quantities[size]}</span>
            </div>
            <div>
              <button onclick={() => decreaseStockPiece(size)} class="item-btn">-</button>
              <button onclick={() => increaseStockPiece(size)} class="item-btn">+</button>
            </div>
            <button onclick={() => removeStockPiece(size)} class="item-btn">X</button>
          </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Pieces -->
    <div class="box pieces">
      <button class="fold-btn" onclick={() => piecesSwitch = !piecesSwitch}><h2>Pieces</h2></button>
      
      <div class={piecesSwitch? "display-block": "display-none"}>
        <div class="box-top">
          <input bind:value={pieceToAdd} type="number" placeholder="Size (mm)">
          <button onclick={addPiece}>Add</button>
        </div>
        <div class="box-bottom">
          {#each pieces as piece}
            <div class="box-items">
              <p>{piece}</p>
              <button onclick={() => removePiece(piece)}  class="item-btn">X</button>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="box options">
      <h2>Cut Options - {cuttingOptions.length}</h2>
      <button onclick={calculateCuts}>calculate</button>
      <div class="options-list">
        {#each cuttingOptions as option}
        <div class="cuts-info">
          <!-- Stock left -->
          <p>Material left: {option.totalMaterialLeft}</p>
          {#each option.remainingStock as stockPiece}
            <p>{stockPiece.original} has {stockPiece.left}mm left </p>
          {/each}
          
          <!-- cuts -->
          <p>How to cut:</p>
          {#each Object.entries(option.cutMap) as [key, values]}
            <p>from {key} cut: [
            {#each values as piece}
              {piece},
            {/each}
            ]
            </p>
          {/each}
        </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<dialog></dialog>

<style>
  main {
    display: flex;
    flex-direction: column;
    background-color: #333;
    height: 100vh;
  }

  .wrapper {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-width: 575px;
    margin: 0 auto;
    background-color: slategray;
  }

  .box {
    padding: 5px 10px;
    color: white;
  }
  
  .pieces {
    /* background-color: rebeccapurple; */
  }

  .options {
    display: flex;
    flex-direction: column;
    flex: 1;
    color: black;
    overflow: hidden;
  }

  .stock {
    /* background-color: azure; */
  }

  .box-top {
    padding: 10px 0;
  }

  .box-bottom {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stock-details {
    display: flex;
    gap: 20px;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    overflow-y: auto;
  }

  .box-items {
    display: flex;
    justify-content: space-between;
  }

  .item-btn {
    border-radius: 5px;
    padding: 0 6px;
  }

  .cuts-info {
    padding: 5px;
    border-radius: 6px;
    color: black;
    background-color: silver;
  }

  h1 {
    color: white;
    text-align: center;
    background-color:black;
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  .display-none {
    display: none;
  }

  .display-block {
    display: block;
  }

  .fold-btn {
    display: block;
    width: 100%;
  }
</style>
