import React,{useState} from 'react'


import  './App.css'
import Navbar from './Componentes/Nabvar/Navbar.jsx'
import Main from './Componentes/Main/Main.jsx'
import Footer from './Componentes/Footer/Footer.jsx'
import Home from './../src/Componentes/Home/Home.jsx'
import Data from '../src/Componentes/Dispositivos.js'


function App() {
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    maxPrice: 50000000000,
  });

  const filteredData = Data.filter((item) => {
    const matchesSearch = item.destTitle
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesBrand =
      filters.brand === '' ||
      item.location.toLowerCase() === filters.brand.toLowerCase();

    const priceNumber = parseInt(item.fees.toString().replace(/\D/g, ''), 10);
    const matchesPrice = priceNumber <= filters.maxPrice;

    return matchesSearch && matchesBrand && matchesPrice;
  });

  return (
    <>
    <Navbar/>
      <Home filters={filters} setFilters={setFilters} />
      <Main productos={filteredData} />
      <Footer/>
    </>
  );
}

export default App;
