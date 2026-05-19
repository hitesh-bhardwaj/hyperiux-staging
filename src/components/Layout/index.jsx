import React from 'react'

import dynamic from 'next/dynamic'
const BottomMenuDes = dynamic(() => import("../menu/BottomMenuDes"),
  {
    ssr: true,
  },
);
const Layout = ({ children }) => {
  return (
    <>
      <BottomMenuDes />
      {children}
    </>
  )
}

export default Layout