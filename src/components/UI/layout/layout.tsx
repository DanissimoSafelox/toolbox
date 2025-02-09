import {type ReactNode} from 'react'
import classes from './_layout.module.scss'

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