// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { WatchFileKind } from 'typescript'
import { ErrorBoundary } from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'


function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {

  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState({status: 'idle', data: null, error: null})
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(()=>{
    if (!pokemonName) return 
    setPokemon({status: 'pending', data: null, error: null})
    fetchPokemon(pokemonName)
      .then(data => {
        setPokemon({status: 'resolved', data, error: null})
      })
      .catch(err => {
        setPokemon({status: 'rejected', data: null, error: err.message})
      })
  }, [pokemonName])

  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  if (pokemon.status === 'rejected' && pokemon.error) throw new Error(pokemon.error);
  if (pokemon.status === 'resolved') {
    return <PokemonDataView pokemon={pokemon.data} />
  } else if (pokemon.status === 'pending') {
    return <PokemonInfoFallback pokemonName={pokemonName} />
  } else {
    return 'Submit a pokemon'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setPokemonName('')
          }}
          resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
      
    </div>
  )
}

export default App
