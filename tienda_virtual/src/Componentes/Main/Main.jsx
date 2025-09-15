import React, { useEffect } from 'react'
import './main.css'
import { LuClipboardCheck } from "react-icons/lu";
import Aos from 'aos';
import 'aos/dist/aos.css'

const Main = ({ productos }) => {

  useEffect(() => {
    Aos.init({ duration: 2000 })
  }, [])

  return (
    <section className='main container section'>
      <div className='secTitle'>
        <h3 data-aos="fade-right" className='title'>
          Nuestro catalogo
        </h3>
      </div>

      <div className="secContent grid">
        {productos.length > 0 ? (
          productos.map(({ id, imgSrc, destTitle, location, grade, fees, description }) => {
            return (
              <div key={id} data-aos="fade-up" className="singleDestination">
                <div className="imageDiv">
                  <img src={imgSrc} alt={destTitle} />
                </div>

                <div className="cardInfo">
                  <h4 className="destTitle">{destTitle}</h4>
                  <span className="continent flex">
                    <span className='name'>{location}</span>
                  </span>
                  <div className="fees flex">
                    <div className="grade">
                      <span>{grade}</span>
                    </div>
                    <div className="price">
                      <h6>{fees}</h6>
                    </div>
                  </div>
                  <div className="desc">
                    <p>{description}</p>
                  </div>
                  <button className='btn flex'>
                    DETALLES <LuClipboardCheck className='icon' />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <p>No hay productos que coincidan con los filtros</p>
        )}
      </div>
    </section>
  )
}

export default Main