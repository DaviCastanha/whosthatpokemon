import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import pokeballImage from './resources/pokeball.png';

function App() {

  const [img, setIMG] = useState('')
  const [nome, setNOME] = useState('')
  const [pokeChoice, setChoice] = useState<string[]>([])
  const [pokeDex, setpokeDex] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const scoreRef = useRef<HTMLParagraphElement | null>(null)
  const [scoreDelay, setDelay] = useState<boolean>(false)

  /*Escolhendo os pokemons para alternativas */
  function choosePoke(list: string[]) {
    const index = Math.floor(Math.random() * (pokeDex.length - 1))
    const current = list.find((value) => value == pokeDex[index])
    if (current == undefined) {
      list.push(pokeDex[index]);
    } else {
      choosePoke(list)
    }
  }

  /*Checando se acertou ou errou o pokemon(Botão)*/
  function checkPoke(item: string) {
    if (nome == item && !scoreDelay) {
      pokeShow()
      const newScore = score + 1
      setScore(newScore)
      if (scoreRef.current) {
        scoreRef.current.textContent = newScore.toString()
      }
      setDelay(true)
      setTimeout(() => {
        setDelay(false)
        poke()
      }, 2000)
    } else if (scoreDelay) {
      alert('Também tentei isso.')
    } else {
      alert(`Não, era o ${nome}`) /*Aqui dá pra fazer um uppercase dps */
      poke()
    }
  }

  function pokeShow() {
    const pokeReveal = document.querySelector('.pokequem') as HTMLImageElement;
    const flashReveal = document.querySelector('.flash') as HTMLImageElement;
    pokeReveal.style.animationName = 'pulse'
  }
  function pokeHide() {
    const flashReveal = document.querySelector('.flash') as HTMLImageElement;
    const pokeReveal = document.querySelector('.pokequem') as HTMLImageElement;
    pokeReveal.style.animationName = 'none'
  }

  /*Puxando os nomes da API e adicionando na lista */
  const pokeNames = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/`)
      .then((resp) => resp.json())
      .then((data: any) => {
        data.results.forEach((value: any) => {
          pokeDex.push(value.name)
        })
        poke()
      })
  }

  /*Criando um poke aleatório, puxando sprite, 
  quantidade de alternativas, lógica para não adicionar repetido */
  const poke = () => {
    const randomPoke = Math.floor(Math.random() * 151) + 1
    // const randomPoke = 74
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomPoke}/`)
      .then((resp) => resp.json())
      .then((data) => {
        pokeHide()
        setIMG(data.sprites.other.dream_world.front_default)
        setNOME(data.name)
        let list: string[] = [data.name];
        const qtd = 5
        for (let i = 0; i <= qtd - 1; ++i) {
          choosePoke(list)
        }
        list = list.sort((a, b) => a < b ? -1 : 1)
        setChoice(list)
      })
  }
  useEffect(() => {
    pokeNames()
  }, [])

  return (
    <div className='poketudo'>
      <div className='pokebox'>
        <h1>Who's that PoKeMoN?</h1>

        <div className='flash'>

          <img src={img} className='pokequem' alt="" />

          <div className='score'>
            <img src={pokeballImage} className='pokeball' alt="" />
            <p ref={scoreRef}>0</p>
          </div>

        </div>

        <div className='pokeoptions'>
          <ul>
            {pokeChoice.map((item, index) => {
              return (<li className='pokebtn' key={index} onClick={() => checkPoke(item)}>{item}</li>)
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
