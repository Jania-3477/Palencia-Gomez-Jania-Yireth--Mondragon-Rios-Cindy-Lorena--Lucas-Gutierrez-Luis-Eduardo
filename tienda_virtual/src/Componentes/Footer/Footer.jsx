import React,{useEffect} from 'react'
import './footer.css'
import { FiSend } from "react-icons/fi";
import { BsPhoneLandscapeFill } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";

import Aos from 'aos';
import'aos/dist/aos.css'

//temporales
import { FaSquareXTwitter } from "react-icons/fa6";

import video2 from '../../Asset/Footer.mp4'

const Footer = () => {

 useEffect(()=>{
    Aos.init({duration:2000})
  },[])


  return (
    <section className='footer'>
      
      
      <div className="videoDiv">
        <video src={video2} loop autoPlay muted type ="video/mp4"></video>
      </div>




    <div className="secContent container">
      
      
      <div className="contactDiv flex">
        <div data-aos="fade-up"  className="text" >
          <small>Recibe lo ultimo en informacion</small>
          <h2> Subscribete </h2>

<div className='inputDiv flex'>
  <input  data-aos="fade-up" type="text" placeholder='enter email andres' />
  <button data-aos="fade-up"  className='btn flex' type='submit'>SEND
    <FiSend className='icon'/>
  </button>
</div>

        </div>
      </div>


<div className="footerCard flex">
  <div className="footerIntro flex">
    <div data-aos="fade-up"  className="logoDiv">
      <a href="#" className="logo flex">
        <BsPhoneLandscapeFill  className='icon'/>PRIMEPHONE 
      </a>
    </div>
<div  data-aos="fade-up"  className="footerParagraph">

Viajar es mucho más que trasladarse de un lugar a otro; es descubrir nuevas experiencias, crear recuerdos y encontrar inspiración en cada destino. Cada producto que ofrecemos está pensado para acompañar ese recorrido y hacerlo más cómodo, seguro y especial.

Nuestro compromiso es brindar calidad y confianza en cada detalle, para que disfrutes sin preocupaciones y aproveches al máximo cada momento. Desde los dispositivos más prácticos hasta aquellos que marcan tendencia, todo está reunido en un solo espacio para que tu elección sea sencilla y acertada.

Explora, compara y encuentra aquello que se ajusta a tu estilo de vida. Lo importante no es solo llegar, sino cómo lo haces y con qué herramientas cuentas en el camino.</div>
<div  data-aos="fade-up" className="footerSocials">
  <FaSquareXTwitter className='icon' />
  <FaSquareXTwitter className='icon' />
  <FaSquareXTwitter className='icon' />

</div>
  </div>

<div  className="footerLinks grid">


<div  data-aos="fade-up" data-aos-duration="4000" className="linkGroup">
  <span className="groupTitle">
    Nuestra Agencia
  </span>

  <li className="footerList flex">
    <FiChevronRight className='icon' />Servicios
  </li>
  <li className="footerList flex">
    <FiChevronRight className='icon' />Sobre Nostros
  </li>

  <li className="footerList flex">
    <FiChevronRight className='icon' />Oficinas
  </li>

  <li className="footerList flex">
    <FiChevronRight className='icon' />Historia
  </li>


</div>

<div data-aos="fade-up" data-aos-duration="4000" className="linkGroup">
  <span className="groupTitle">
    Atencion al cliente
  </span>

  <li className="footerList flex">
    <FiChevronRight className='icon' /> (FAQ)
  </li>
  <li className="footerList flex">
    <FiChevronRight className='icon' />PQR
  </li>

  <li className="footerList flex">
    <FiChevronRight className='icon' />T&C
  </li>

  <li className="footerList flex">
    <FiChevronRight className='icon' />Politicas y privacidad
  </li>


</div>

<div data-aos="fade-up" data-aos-duration="4000" className="linkGroup">
  <span className="groupTitle">
   Siguenos 
  </span>

  <li className="footerList flex">
    <FiChevronRight className='icon' />Facebook
  </li>
  <li className="footerList flex">
    <FiChevronRight className='icon' />Instagram
  </li>

  <li className="footerList flex">
    <FiChevronRight className='icon' />Twitter
  </li>

  <li className="footerList flex">
    <FiChevronRight className='icon' />Tiktok
  </li>


</div>

</div>




</div>



    </div>


    </section>



  )
}

export default Footer
