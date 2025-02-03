import classes from './currencyConverter.module.css'
import {type Dispatch, type FC, type SetStateAction, useEffect, useState} from 'react'

interface blockProps {
	value: string
	currency: string
	onChangeValue: (value: string) => void
	onChangeCurrency: Dispatch<SetStateAction<Currency>>
}

type Currency =
	| "AUD"
	| "AZN"
	| "GBP"
	| "AMD"
	| "BYN"
	| "BGN"
	| "BRL"
	| "HUF"
	| "VND"
	| "HKD"
	| "GEL"
	| "DKK"
	| "AED"
	| "USD"
	| "EUR"
	| "EGP"
	| "INR"
	| "IDR"
	| "KZT"
	| "CAD"
	| "QAR"
	| "KGS"
	| "CNY"
	| "MDL"
	| "NZD"
	| "NOK"
	| "PLN"
	| "RON"
	| "XDR"
	| "SGD"
	| "TJS"
	| "THB"
	| "TRY"
	| "TMT"
	| "UZS"
	| "UAH"
	| "CZK"
	| "SEK"
	| "CHF"
	| "RSD"
	| "ZAR"
	| "KRW"
	| "JPY"
	| "RUB"

interface Icurrency {
	CharCode: Currency
	ID: string
	Name: string
	Nominal: number
	NumCode: string
	Previous: number
	Value: number
}

const defaultCurrencies: Currency[] = [ 'RUB', 'USD', 'EUR', 'CNY' ]

const rate: Record<Currency, Icurrency> =  {
	RUB: {
		CharCode: 'RUB',
		ID: 'VVP',
		Name: 'Рубль',
		Nominal: 1,
		NumCode: 'VVP',
		Previous: 1,
		Value: 1
	}
}


const Block: FC<blockProps> = ({ value, currency, onChangeValue, onChangeCurrency}) => {
	return (
		<div className={classes.block}>
			<ul className={classes.currenciesList}>
				{defaultCurrencies.map((cur) => (
					<li
						onClick={() => onChangeCurrency(cur)}
						className={currency === cur ? classes.active : ''}
						key={cur}
					>
						{cur}
					</li>
				))}
				<li>
					<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 16 16'>
						<path fill='currentColor' fill-rule='evenodd'
						      d='M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06'
						      clip-rule='evenodd'/>
					</svg>
				</li>
			</ul>
			<input
				onChange={(e) =>  onChangeValue(e.target.value)}
				type='number'
				value={value}
				min={0}
				className={classes.input}
			/>
		</div>
	)
}


export const CurrencyConverter = () => {
	const [fromCurrency, setFromCurrency] = useState<Currency>(defaultCurrencies[0])
	const [toCurrency, setToCurrency] = useState<Currency>(defaultCurrencies[1])
	const [fromPrice, setFromPrice] = useState('')
	const [toPrice, setToPrice] = useState('')

	const [rates, setRates] = useState<Record<Currency, Icurrency> | null>()


	useEffect(() => {
		fetch('https://www.cbr-xml-daily.ru/daily_json.js')
			.then((res) => res.json())
			.then((json) => {
				setRates({...json.Valute, ...rate})
				console.log(json.Valute)
			}).catch(err => {
				console.warn(err)
				alert('Не удалось получить данные')
		})
	}, [])


	const onChangeToPrice = (value: string) => {
		if (!rates) return
		if (!value) {
			setToPrice(value)
			setFromPrice(value)
			return
		}
		const res = (Number(value) * rates[toCurrency].Value / rates[fromCurrency].Value)
		setFromPrice(res >= 1 ? res.toFixed(3) : 0 < res && res < 0.00001 ? res.toExponential(3) : res.toFixed(6))
		setToPrice(value.replace(/^0\d/, value.replace(/^0/, '')))
	}

	const onChangeFromPrice = (value: string) => {
		if (!rates) return
		if (!value) {
			setToPrice(value)
			setFromPrice(value)
			return
		}
		if(value.slice(0, value.indexOf('.')).length > 1 && value[0] === '0') return
		console.log('До запятой', value.slice(0, value.indexOf('.')))

		const res = (Number(value) * rates[fromCurrency].Value / rates[toCurrency].Value)
		setToPrice(res >= 1 ? res.toFixed(3) : 0 < res && res < 0.00001 ? res.toExponential(3) : res.toFixed(6))
		setFromPrice(value.replace(/^0\d/, value.replace(/^0/, '')))
		console.log(value.replace(/^0\d/, value.replace(/^0/, '')))
	}


	useEffect(() => {
		setFromPrice(prevState => onChangeFromPrice(prevState))
	}, [fromCurrency])

	useEffect(() => {
		setToPrice(prevState => onChangeToPrice(prevState))
	}, [toCurrency])



	return (
		<div className={classes.currencyConverter}>
			<Block
				value={fromPrice}
				currency={fromCurrency}
				onChangeCurrency={setFromCurrency}
				onChangeValue={onChangeFromPrice}
			/>
			<Block
				value={toPrice}
				currency={toCurrency}
				onChangeCurrency={setToCurrency}
				onChangeValue={onChangeToPrice}
			/>
		</div>
	)
}


// const onChangeToPrice = useCallback((value: string) => {
// 	if (!rates) return
// 	const numValue = value === '' ? 0 : Number(value)
// 	const price = toCurrency === 'RUB' ? numValue : numValue * rates[toCurrency].Value
// 	const result = fromCurrency === 'RUB' ? price : price / rates[fromCurrency].Value
// 	setFromPrice(result.toString())
// 	setSkipPrice(value)
// }, [fromCurrency, rates, toCurrency])
//
// const onChangeFromPrice = useCallback((value: string) => {
// 	if (!rates) return
// 	const numValue = value === '' ? 0 : Number(value)
// 	const price = fromCurrency === 'RUB' ? numValue : numValue * rates[fromCurrency].Value
// 	const result = toCurrency === 'RUB' ? price : price / rates[toCurrency].Value
// 	setToPrice(result.toString())
// 	setSkipPrice(value)
// }, [fromCurrency, rates, toCurrency])