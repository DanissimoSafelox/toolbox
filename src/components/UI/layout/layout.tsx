import {type ReactNode} from 'react'
import classes from './layout.module.css'

interface NavBarProps {
	children: ReactNode
}


export const Layout = ({children} : NavBarProps) => {
	return (
		<div className={classes.layout}>
			{children}
		</div>
	)
}