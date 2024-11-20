import {
    HiOutlineViewGrid,
    HiDocumentReport,
} from 'react-icons/hi'
import { MdInventory2 } from "react-icons/md";
import { AiFillSchedule } from "react-icons/ai";

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'edashboard',
        label: 'Dashboard',
        path: '/edashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'einventory',
        label: 'Inventory',
        path: 'einventory',
        icon: <MdInventory2 />
    },
    {
        key: 'esalesreport',
        label: 'SalesReport',
        path: 'esalesreport',
        icon: <HiDocumentReport />
    },
    {
        key: 'eschedule',
        label: 'Schedule',
        path: 'eschedule',
        icon: <AiFillSchedule />
    },
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    
]