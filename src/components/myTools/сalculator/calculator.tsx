import classes from './_calculator.module.scss'
import {useEffect, useState} from 'react'

const buttons = [
	{val: '1'}, {val: '2'}, {val: '3'},
	{val: '4'}, {val: '5'}, {val: '6'},
	{val: '7'}, {val: '8'}, {val: '9'},
	{val: ','}, {val: '0'}, {val: 'CE'},
	{val: '+'}, {val: '-'}, {val: 'C'},
	{val: '*'}, {val: '/'}, {val: '='},
	// {val: '('}, {val: ')'}, {val: 'π'}, {val: 'e'},

]

export const Calculator = () => {
	const [inputValue, setInputValue] = useState('')
	const [lastNumber, setLastNumber] = useState('')
	const [calcArray, setCalcArray] = useState([])
	const [result, setResult] = useState('Здесь будет результат')

	const inputHandleClick = (value: string) => {
		let currentValue = inputValue
		let newValue = value

		if (!isNaN(Number(newValue)) || newValue === ',') {
			if (currentValue === '0' && newValue !== ',') {
				currentValue = ''
			}
			if (newValue === ',') setLastNumber(lastNumber + '.')
			else setLastNumber(lastNumber + newValue)
		}
		else {
			switch (newValue) {
				case '=' : {
					if (currentValue === '') { return }
					setCalcArray([...calcArray, parseFloat(lastNumber), newValue])
					setLastNumber('')
					currentValue = ''
					newValue = ''
					break
				}
				case 'CE' : {
					newValue = ''
					currentValue = currentValue.slice(0, -1)
					setLastNumber(lastNumber.slice(0, -1))
					if (calcArray.length >= 2) { setCalcArray(calcArray.slice(0, -2)) }
					break
				}
				case 'C' : {
					newValue = ''
					currentValue = ''
					setLastNumber('')
					setCalcArray([])
					break
				}
				// case 'π' : {
				// 	newValue = 'π'
				// 	setLastNumber('')
				// 	if (currentValue === '') { setCalcArray([...calcArray, parseFloat(lastNumber), '*']) }
				// 	else if (currentValue.slice(-1) === ',') { setCalcArray([...calcArray, '*', parseFloat(lastNumber), '*']) }
				// 	break
				// }
				// case 'e' : {
				// 	// newValue = 'e'
				// 	// setLastNumber('')
				// 	// setCalcArray([])
				// 	break
				// }
				default : {
					if (currentValue === '') return
					if (!isNaN(Number(currentValue.slice(-1))) || currentValue.slice(-1) === ','){
						setCalcArray([...calcArray, parseFloat(lastNumber), newValue])
					}
					else {
						setCalcArray([...calcArray.slice(0, -1), newValue])
						currentValue = currentValue.slice(0, -1)
					}
					setLastNumber('')
					break
				}
			}
		}

		setInputValue(currentValue + newValue)
		// console.log(calcArray)
	}

	const calculate = (array: Array<string | number>): string => {
		console.log(`--calculate-array:`)
		console.log(array)
		if (array.length < 3) return array[0].toString()

		let calculatedArray = array.slice(0, -1)
		setCalcArray([])

		const sumActions = []
		const multiplyActions: Array<number> = []

		for (let i = 1; i < calculatedArray.length; i+= 2) {
			if ('+-'.includes(`${calculatedArray[i]}`)){
				sumActions.push(i)
			}
			else if ('*/'.includes(`${calculatedArray[i]}`)) {
				multiplyActions.push(i)
			}
		}

		let actionOffset = 0
		for (const elemId of multiplyActions) {
			let newNumber: number
			const actualOffset = elemId - actionOffset

			if (calculatedArray[actualOffset] === '*') {
				newNumber = calculatedArray[actualOffset - 1] * calculatedArray[actualOffset + 1]
			}
			else {
				if (calculatedArray[actualOffset + 1] === 0) return 'Делить на 0 нельзя'
				newNumber = calculatedArray[actualOffset - 1] / calculatedArray[actualOffset + 1]
			}
			calculatedArray = [...calculatedArray.slice(0, actualOffset - 1), newNumber, ...calculatedArray.slice(actualOffset + 2)]
			actionOffset += 2
		}

		actionOffset = 0
		for (const elemId of sumActions) {
			let newNumber: number
			const actualOffset = elemId - actionOffset

			if (calculatedArray[actualOffset] === '+') {
				newNumber = calculatedArray[actualOffset - 1] + calculatedArray[actualOffset + 1]
			}
			else {
				newNumber = calculatedArray[actualOffset - 1] - calculatedArray[actualOffset + 1]
			}
			calculatedArray = [...calculatedArray.slice(0, actualOffset - 1), newNumber, ...calculatedArray.slice(actualOffset + 2)]
			actionOffset += 2
		}

		console.log(`--calculate-sumActions:`)
		console.log(sumActions)
		console.log(`--calculate-multiplyActions:`)
		console.log(multiplyActions)
		console.log(`--calculate-res: ${calculatedArray}`)

		return calculatedArray.join('|')
	}


	useEffect(() => {
		console.log(`---useEffect: calcArray = ${calcArray}`)
		if (calcArray[calcArray.length - 1] === '=') setResult(calculate(calcArray))
	}, [calcArray])


	return (
		<div className={classes.calculator}>
			<div className={classes.inner}>
				<div className={classes.display}>
					<input className={classes.input} type='text' readOnly={true} value={inputValue}/>
					<p className={classes.output}>{result}</p>
				</div>
				<div className={classes.buttonsPanel}>
					{buttons.map((item) => {
						return <>
							<button className={classes.button + ' button'} onClick={() => inputHandleClick(item.val)}>
								{item.val}
							</button>
						</>
					})}
				</div>
			</div>
		</div>
	)
}
