import React,{useState} from 'react'
import { HiDevicePhoneMobile } from "react-icons/hi2";

import { TbGridDots } from "react-icons/tb";
import { IoCloseCircleSharp } from "react-icons/io5";
import './navbar.css'
const Navbar = () => {
  
   const [active, setActive] = useState ('navBar')
   //funcion para cerrar 
   const showNav= ()=>{
   setActive('navBar activeNavbar')
   }

   //cerrar navbar
   const removeNabvar=()=>{
    setActive('navBar')
   }
   
  return (
   

<section className='navBarSection'>
  <header className='header flex'>


    <div className='logoDiv'>
      <a href='#' className='logo'>
        <h1 > <HiDevicePhoneMobile className='icon' /> PrimePhone</h1>
      </a>
    </div>

    <div className={active}>

      <ul className="navList flex">
<li className="navItem">
  <a href="#" className="navLink">Inicio</a>
</li>
<li className="navItem">
  <a href="#" className="navLink">Productos</a>
</li>
<li className="navItem">
  <a href="#" className="navLink">Carrito</a>
</li>

  <button className='btn'>  

    <a href="#">Mi CUENTA</a>

  </button>
  
      </ul>




<div onClick={removeNabvar} className='closeNavbar'>
  <IoCloseCircleSharp className='icon'/>
</div>


    </div>
<div onClick={showNav} className="toggleNavbar">
<TbGridDots className='icon'/>
</div>
    


  </header>
</section>




  )
}

export default Navbar