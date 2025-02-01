import react from "react"
import "./Header.css"
import {NavLink} from 'react-router-dom'

function Header(){
    return(
        <div className="header">
            <h1>The Boring Store</h1>
            <NavLink to='/cart'><button className="cart_button">View cart</button></NavLink>
        </div>
    )
}
export default Header