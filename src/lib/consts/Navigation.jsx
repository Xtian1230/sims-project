import {
	HiOutlineViewGrid,
	HiOutlineCube,
    HiDocumentReport,
} from 'react-icons/hi'
import { MdInventory2 } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'products',
		label: 'Products',
		path: 'products',
		icon: <HiOutlineCube />
	},
	{
		key: 'inventory',
		label: 'Inventory',
		path: 'inventory',
        icon: <MdInventory2 />
	},
	{
		key: 'reports',
		label: 'Reports',
		path: 'reports',
        icon: <HiDocumentReport />
	},
	{
		key: 'employees',
		label: 'Employees',
		path: 'employees',
        icon: <BsFillPeopleFill />
	},
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	
]