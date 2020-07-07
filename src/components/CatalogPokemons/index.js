import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './style.css';

export default function CatalogPokemons() {
  
  const [ offset, setOffset ] = useState(0);
  const [ data, setData ] = useState([]);
  const [ shoppingClient, setShoppingClient ] = useState([]);
  const [ valueTotal, setValueTotal ] = useState(0);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`).then(response => {
      let result = response.data.results;
      result = result.map(r => {
        const idPoke = r.url.split('/').slice(-2,-1);
        return {
          ...r,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${idPoke}.png`,
          idPoke,
          preco: 20
        }
      });
      setData(result);
    })
  },[,offset]);

  useEffect(() => {
    const SaveValueTotal = localStorage.getItem("valueTotal");
    const SaveShoppingClient = localStorage.getItem("shoppingClient");
    
    if(SaveValueTotal !== null) {
      setValueTotal(Number(SaveValueTotal));
    }

    if(SaveShoppingClient !== null) {
      setShoppingClient(JSON.parse(SaveShoppingClient));
    }

  },[]);

  function handlePreviousPage() {
    if(offset - 20 >= 0) {
      setOffset(offset-20);
    }else{
      setOffset(0);
    }
  }

  function handleNextPage() {
    setOffset(offset+20);
  }

  function handleFinallyBuy() {
    localStorage.clear();
    alert("Compra Efetuada");
    setValueTotal(0);
    setShoppingClient([]);
  }

  function addCarBuy(id) {
    const poke = data.find(p => p.idPoke === id);
    if(!poke){
      return;
    }
    setValueTotal(valueTotal + poke.preco);
    localStorage.setItem("valueTotal", valueTotal);

    const index = shoppingClient.findIndex(p => p.idPoke === id);
    const infoBuyPoke = {
      idPoke: poke.idPoke,
      name: poke.name,
      qtd: 1,
      value: poke.preco
    } 

    if(index > -1){
      const copyShoppingClient = shoppingClient.slice();
      copyShoppingClient[index].qtd++;
      setShoppingClient([...copyShoppingClient]);
    }else{
      setShoppingClient([...shoppingClient, infoBuyPoke]);
    }
    localStorage.setItem("shoppingClient", JSON.stringify(shoppingClient));
  }

  function generateCatalog() {
    return (
      [0,1,2,3].map(ind => (
        <div className="rowCards">
          {data.slice(ind*5,(ind+1)*5).map(poke => (
            <div key={poke.idPoke} className="card">
              <img src={poke.image}></img>
              <h5>R$ {poke.preco}</h5>
              <h5>{poke.name}</h5>
              <button type="submit" onClick={() => addCarBuy(poke.idPoke)} >Comprar</button>
            </div>
          ))}
        </div>
      ))
    );
  }

  return (
    <>
      <div id="content">
        <div id="contentCards">
          {generateCatalog()}
        </div>
        <div id="buyCar">
        { valueTotal === 0 ? "" : (<h3>Compras</h3>)}
          {shoppingClient.map(dataBuy => (
            <h5>{dataBuy.name} : {dataBuy.qtd} x {dataBuy.value}</h5>
          ))}
          <h3>{ valueTotal === 0 ? "Carrinho Vazio" : `Total: R$ ${valueTotal}`}</h3>
          {valueTotal === 0 ? "" : <button type="submit" onClick={handleFinallyBuy} >Finalizar Compra</button>}
        </div>
      </div>
      <div id="buttonsNavigate">
        <button type="submit" onClick={handlePreviousPage} >Anterior</button>
        <button type="submit" onClick={handleNextPage} >Proximo</button>
      </div>
    </>
  );
}