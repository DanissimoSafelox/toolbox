import classes from './_currencyConverter.module.scss'
import {type Dispatch, type FC, type SetStateAction, useEffect, useRef, useState} from 'react'

interface blockProps {
	value: string
	currency: string
	onChangeValue: (value: string) => void
	onChangeCurrency: Dispatch<SetStateAction<Currency>>
}

type Currency = string

// type Currency =
// 	  "AUD"
//	   | "USD"
// ... А если Германия выйдет из ЕС


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
		Name: 'Российский Рубль',
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
						<p>
							{cur}
						</p>
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
	const [toPrice, setToPrice] = useState('1')

	const ratesRef = useRef<Record<Currency, Icurrency>>()


	useEffect(() => {
		const fetchData = () => {
			const now = new Date();
			const currentHour = now.getHours()
			const storedData = localStorage.getItem('apiData_cbr');
			if (storedData) {
				const {data: cachedData, timestamp} = JSON.parse(storedData);
				const cachedHour = new Date(timestamp).getHours();
				if (cachedHour === currentHour) {
					ratesRef.current = cachedData;
					onChangeToPrice(toPrice)
					return;
				}
			}
			fetch('https://www.cbr-xml-daily.ru/daily_json.js')
				.then((res) => res.json())
				.then((json) => {
					//TODO Слишком большой объект, нужно оставить только необходимые поля
					//TODO важные поля - Name, Value, Nominal
					//TODO Учитывать Nominal - нужно разделить на него Value, и тогда будет реальный курс
					localStorage.setItem(
						'apiData_cbr',
						JSON.stringify({
							data: {...json.Valute, ...rate},
							timestamp: now.toISOString(),
						})
					)
					ratesRef.current = {...json.Valute, ...rate}
					onChangeToPrice(toPrice)
					console.log(`Получены данные с ЦБ РФ, актуальные на ${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} ${currentHour}:00`)
				}).catch(err => {
				console.warn(err)
				alert('Не удалось получить данные')
			})
		}
		fetchData()
	}, [])


	const onChangeToPrice = (value: string) => {
		if (!ratesRef.current) return
		if (!value) {
			setToPrice(value)
			setFromPrice(value)
			return
		}

		const res = (Number(value) * ratesRef.current[toCurrency].Value / ratesRef.current[fromCurrency].Value)
		setFromPrice(res >= 1 ? res.toFixed(3) : 0 < res && res < 0.00001 ? res.toExponential(3) : res.toFixed(6))
		setToPrice(value.replace(/^0\d/, value.replace(/^0/, '')))
	}

	const onChangeFromPrice = (value: string) => {
		if (!ratesRef.current) return
		if (!value) {
			setToPrice(value)
			setFromPrice(value)
			return
		}
		if(value.slice(0, value.indexOf('.')).length > 1 && value[0] === '0') return

		const res = (Number(value) * ratesRef.current[fromCurrency].Value / ratesRef.current[toCurrency].Value)
		setToPrice(res >= 1 ? res.toFixed(3) : 0 < res && res < 0.00001 ? res.toExponential(3) : res.toFixed(6))
		setFromPrice(value.replace(/^0\d/, value.replace(/^0/, '')))
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