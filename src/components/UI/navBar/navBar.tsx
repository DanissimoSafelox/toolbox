import {Children, type FC, type ReactNode} from 'react'
import classes from './navBar.module.css'

interface NavBarProps {
	children: ReactNode
}


export const NavBar: FC<NavBarProps> = ({children}) => {

	return (
		<div className={classes.navBar}>
			<nav className={classes.panel}>
				<ul className={classes.list}>
					{Children.map(children, (child) => {
						return (
							<li className={classes.item}>
								{child}
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}

