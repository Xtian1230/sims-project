import {
    HiOutlineViewGrid,
    HiDocumentReport,
    HiOutlineCube
} from 'react-icons/hi'
import { MdInventory2 } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { AiFillSchedule } from "react-icons/ai";

export const SPDASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'spdashboard',
        label: 'Dashboard',
        path: '/spdashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'spinventory',
        label: 'Inventory',
        path: 'spinventory',
        icon: <MdInventory2 />
    },
    {
        key: 'spproduct',
        label: 'Products',
        path: 'spproduct',
        icon: <HiOutlineCube />
    },
    {
        key: 'spsalesreport',
        label: 'SalesReport',
        path: 'spsalesreport',
        icon: <HiDocumentReport />
    },
    {
        key: 'spemployee',
        label: 'Employee',
        path: 'spemployee',
        icon: <BsFillPeopleFill />
    },
    {
        key: 'spschedule',
        label: 'Schedule',
        path: 'spschedule',
        icon: <AiFillSchedule />
    },
]

export const SPDASHBOARD_SIDEBAR_BOTTOM_LINKS = [
   
]