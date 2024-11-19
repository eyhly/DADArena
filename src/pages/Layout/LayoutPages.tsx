import React from 'react'
import SidebarAdmin from '../../components/Navigation/SidebarAdmin'
import { Outlet } from 'react-router-dom'

// const miniDrawerWidth = 260;
// const drawerWidth = 72;

const LayoutPages = () => {
// const [isDrawerOpen, setIsOpenDrawer] = useState(false)
// const handleToggleDrawer= () => {
//   setIsOpenDrawer(!isDrawerOpen)
// }

  return (
    <div>
        <SidebarAdmin
        // isDrawerOpen={isDrawerOpen} 
        // toggleDrawer={handleToggleDrawer}
        />

        <Outlet/>
    </div>  
  )
}

export default LayoutPages