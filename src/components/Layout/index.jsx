import React from 'react'
// import { Menu } from '../nav/Menu'
// import { OsmoMenuMobile } from '../nav/OsmoMenuMobile'
import BottomMenuDes from '../menu/BottomMenuDes'

const Layout = ({children}) => {
  return (
    <>
     <BottomMenuDes/>
     {children}
    </>
  )
}

export default Layout