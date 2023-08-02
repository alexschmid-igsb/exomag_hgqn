import * as React from 'react'

import API from '../../api/fetchAPI'

import './MainMenu.scss'

import Box from '@mui/material/Box'

import TableIcon from '@mui/icons-material/TableView'
import ScubaDivingIcon from '@mui/icons-material/ScubaDiving'
import ScienceIcon from '@mui/icons-material/Science'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import FolderIcon from '@mui/icons-material/Folder'
import GridsIcon from '@mui/icons-material/AutoAwesomeMotion'
import GridIcon from '@mui/icons-material/Article'

import HomeIcon from '@mui/icons-material/HomeRounded'

import { Icon as IconifyIcon, InlineIcon as IconifyIconInline } from "@iconify/react"

import PopoverMenu from '../../components/PopoverMenu'
import RouterButton from '../../components/RouterButton'

export default function MainMenu() {

    // Default in der base instance: Ein home menu und ein dynamisch aus den grid generiertes submenü für die grids.

    /*
    const [gridsSubmenu, setGridsSubmenu] = React.useState([])

    React.useEffect(() => {
        API.get('/api/grids/get').then((data) => {
            let submenu = []
            for(let group of data) {
                let groupEntry = group.name === 'root' ? null : {
                    key: group.id,
                    label: group.name,
                    icon: FolderIcon,
                    items: []
                }
                for(let grid of group.grids) {
                    let gridEntry = {
                        key: grid.id,
                        label: grid.name,
                        icon: GridIcon,
                        routerPath: `/grids/${grid.id}`,
                    }
                    if(groupEntry) {
                        groupEntry.items.push(gridEntry)
                    } else {
                        submenu.push(gridEntry)
                    }
                }
                if(groupEntry) {
                    submenu.push(groupEntry)
                }
            }
            setGridsSubmenu(submenu)
        })
    }, [])

    const menu = [
        {
            key: "home",
            label: "Home",
            path: "/home",
            icon: <HomeIcon />
        },
        {
            key: "grids",
            label: "Data Grids",
            menu: gridsSubmenu,
            icon: <GridsIcon/>
        }
    ]
    */



    // Für ExomAG und HGQN generiert man simplerweise die menüeinträge aus festgelegten top level grids denen man dann noch über die grid id den router link generiert

    const [menu, setMenu] = React.useState([{
        key: "home",
        label: "Home",
        path: "/home",
        icon: <HomeIcon />
    }])

    const gridEntries = {
        'Cases': {
            label: 'Cases',
            icon: <IconifyIcon icon="bi:file-earmark-medical-fill"/>            // alternativ bi:journal-medical
        },
        'Variants': {
            label: 'Variants',
            icon: <IconifyIcon icon="material-symbols:genetics-rounded"/>
        }
    }

    React.useEffect(() => {
        API.get('/api/grids/get').then((data) => {
            let temp = [...menu]
            for(let group of data) {
                for(let grid of group.grids) {
                    if(gridEntries[grid.name] != null) {
                        let gridEntry = gridEntries[grid.name]
                        temp.push({
                            key: grid.id,
                            label: gridEntry.label,
                            path: `/grids/${grid.id}`,
                            icon: gridEntry.icon
                        })
                    }
                }
            }
            setMenu(temp)
        })
    }, [])



    return (
        <Box className="menu main-menu" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            { menu.map( entry => 
                entry.menu ? 
                <PopoverMenu
                    useHover={false}
                    buttonClass="menu-button main-menu-button"
                    menuClass="main-menu-submenu-list"
                    buttonKey={entry.key}
                    buttonLabel={entry.label}
                    buttonIcon={entry.icon}
                    popoverId="main-menu-submenu-grid"
                    popoverClass="main-menu-submenu"
                    paperClass="main-menu-submenu-paper"
                    items={entry.menu}
                />
                :
                <RouterButton
                    className="menu-button main-menu-button"
                    uniqueKey={entry.key}
                    to={entry.path ? entry.path : "/home"}
                    icon={entry.icon}
                >
                    { entry.label }
                </RouterButton>
            )}
        </Box>
    )
}

