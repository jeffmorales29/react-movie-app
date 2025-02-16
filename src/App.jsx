import React from 'react'
import Search from './components/search'
import Spinner from './components/spinner';
import { useEffect, useState } from 'react'
import MovieCard from './components/MovieCard';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept:'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(' ');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try{
        const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        const response = await fetch(endpoint, API_OPTIONS);

        if(!response.ok){
          throw new Error('Failed to fetch Movies');
        }
        const data = await response.json();

        if(data.Response === 'False'){
          setErrorMessage(data.error || 'Failed to Fetch movies');
          setMovieList([]);
          return;
        }

        setMovieList(data.results);  // ✅ Set movie list from API response


    }catch(error){
      console.error(`Error Fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later')
    } finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
      fetchMovies();
  },[]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="hero" />
            <h1>Find  <span className="text-gradient">Movies</span> You'll enjoy without the hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className="mt-[40px]">All movies</h2>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>

        </div>
      </div>
    </main>
  )
}

export default App