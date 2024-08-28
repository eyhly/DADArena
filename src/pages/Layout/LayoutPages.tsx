import React from 'react'
import SidebarAdmin from '../Sidebar/SidebarAdmin'
import { Outlet } from 'react-router-dom'

const LayoutPages = () => {
  return (
    <div>
        <SidebarAdmin/>
        <Outlet/>
    </div>
  )
}

export default LayoutPages