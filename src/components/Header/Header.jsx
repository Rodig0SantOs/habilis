import React, { useEffect, useState } from "react";

/* Image | logo */
import Logo from "../../../public/huby_symbol_color.png";

/* Css */
import style from "./Header.module.css";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`${style.container} ${isScrolled ? style.scrolled : ""}`}
    >
      <div className={style.content}>
        <img
          onClick={handleClick}
          src={Logo}
          alt="Habilis - CSIRT"
          className={style.logoImage}
        />
        <nav>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/habilis.sistemas/"
                target="_blank"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/people/Habilis-Sistemas/61559838983322/"
                target="_blank"
              >
                <FaFacebook />
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/+5538988690384?text=Bem-vindo%20ao%20canal%20de%20denuncias%20relacionadas%20a%20Habilis"
                target="_blank"
              >
                <FaWhatsapp />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
