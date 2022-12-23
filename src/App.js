/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
//IMPORTANDO REACT
import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';
import './App.css'

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [FeaturedData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

useEffect(()=>{
    const loadAll = async() => {
      // PEGANDO A LISTA TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // PEGANDO O FEATURED - FILME EM DESTAQUE
      let originals = list.filter(i=> i.slug === 'originals');

      //GERANDO FILME ALEATÓRIO
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));

      //PEGANDO UM FILME ESPECÍFICO
      let chosen = originals[0].items.results[randomChosen];

      //BUSCA AS INFORMAÇÕES ADICIONAIS DO FILME ESPECÍFICO
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      //INSERINDO AS INFORMAÇÕES EM FEATUREDDATA
      setFeaturedData(chosenInfo);

    }
    loadAll();
  },[]);

  useEffect(() =>{
    const scrollListner = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      }
      else{
          setBlackHeader(false);
        
      }
    }

    window.addEventListener('scroll', scrollListner);
    return()=>{
      window.removeEventListener('scroll', scrollListner);
    }
  },[]);

  return (
    <div className="page">
        <Header black={blackHeader}/>

      {FeaturedData &&
        <FeaturedMovie item={FeaturedData} />
      }


      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}

      </section> {/* fecha section lists */}

      <footer>
        Desenvolvido para estudos React/Font-End com base no canal <bold>Bonieky Lacerda</bold> do YouTube<br/>
        Direitos de Imagem: Netflix - Base de Dados: Themoviedb.org<br/>Por Leonardo Reis
      </footer>

      {movieList <= 0 &&
      <div className='loading'>
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
      </div>
      }
    </div>
  );
}