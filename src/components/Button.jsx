import React from 'react'
import styles from './Button.module.css'

export default function Button({children, type, onClick, ...restProps}) {
  return (
    <button {...restProps} className={`${styles.btn} ${styles[type]}`} onClick={onClick} >{children}</button>
  )
}
