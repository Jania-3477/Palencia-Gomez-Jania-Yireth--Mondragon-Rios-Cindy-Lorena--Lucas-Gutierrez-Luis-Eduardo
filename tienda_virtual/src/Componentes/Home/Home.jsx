import React, { useEffect } from 'react'
import './home.css'
import video from '../../Asset/Banner.mp4';
import { GrLocation } from 'react-icons/gr';
import { HiFilter } from 'react-icons/hi';
import Aos from 'aos';
import 'aos/dist/aos.css'

const Home = ({ filters, setFilters }) => {

  useEffect(() => {
    Aos.init({ duration: 2000 })
  }, [])

  return (
    <section className='home'>
      <div className="overlay"></div>
      <video src={video} muted autoPlay loop type="video/mp4"></video>

      <div data-aos="fade-up" className="homeContent container">
        <div className="textDiv">
          <span data-aos="fade-up" className="smallText">
            Productos destacados
          </span>
          <h1 data-aos="fade-up" className="homeTitle">
            Encuentra tu proximo dispositivo
          </h1>
        </div>

        <div className="cardDiv grid">

          {/* Buscador */}
          <div className="destinationInput">
            <label htmlFor="city"> Busca tu dispositivo:</label>
            <div className="input flex">
              <input
                type="text"
                placeholder='Enter Name..'
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <GrLocation className="icon" />
            </div>
          </div>

          {/* Marca */}
          <div className="dateInput">
            <label htmlFor="year">Marca del dispositivo:</label>
            <div className="input flex">
              <select
                id="year"
                name="year"
                value={filters.brand}
                onChange={(e) =>
                  setFilters({ ...filters, brand: e.target.value })
                }
              >
                <option value="">Todas</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Google">Google</option>
                <option value="HP">HP</option>
                <option value="Dell">Dell</option>
                <option value="Lenovo">Lenovo</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Asus">Asus</option>
              </select>
            </div>
          </div>

          {/* Precio */}
          <div className="PriceInput">
            <div className="label_total flex">
              <label htmlFor="price">Max price:</label>
              <h3 className="total">${filters.maxPrice.toLocaleString()}</h3>
            </div>
            <div className="input flex">
              <input
                type="range"
                id="price"
                min="0"
                max="5000000"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="searchOptions flex">
            <HiFilter className='icon' />
            <span>Mas Filtros</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home