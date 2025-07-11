"use client";
import React from "react";
import css from "./Navigation.module.css";
import Link from "next/link";
import Image from "next/image";

function Navigation() {
  return (
    <nav className={css.navBar}>
      <Link href="/" className={css.logo}>
        <Image src="/assets/hyf.svg" alt="Logo" width={49} height={49} priority />
      </Link>
      <ul className={css.navList} style={{ flex: 1 }}>
        <li className={css.navItem}>
          <a href="/" className={css.navLink}>Home</a>
        </li>
        <li className={css.navItem}>
          <Link href="/reservations" className={css.navLink}>Reservations</Link>
        </li>
        <li className={css.navItem}>
          <a href="/meals/add" className={css.navLink}>Add Meal</a>
        </li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/profile" className={css.profileIcon} aria-label="Profile">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;