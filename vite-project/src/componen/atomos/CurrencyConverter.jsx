import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Styles.css';

Modal.setAppElement('#root'); // Establece el elemento raíz de la aplicación

const customStyles = {
  content: {
    width: '300px',
    height: '100px',
    margin: 'auto',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e86de',
    color: '#fff',
  },
};

function App() {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('MXN');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [conversionAlert, setConversionAlert] = useState(null);

  useEffect(() => {
    axios.get('https://api.currencyapi.com/v3/latest', {
      params: {
        apikey: 'cur_live_yAQ4JRu46IUcPiR5hMpsQW6F7dPZz94MaNDWlNfE',
      }
    })
    .then(response => {
      setExchangeRates(response.data.data);
    })
    .catch(error => {
      console.error('Error al obtener los datos de la API:', error);
    });

    const loadedConversionHistory = [
      // Supongamos que aquí tienes algunas conversiones preexistentes
    ];

    setConversionHistory(loadedConversionHistory);
  }, []);

  useEffect(() => {
    if (exchangeRates && fromCurrency !== toCurrency) {
      const fromRate = exchangeRates[fromCurrency].value;
      const toRate = exchangeRates[toCurrency].value;
      const result = (amount / fromRate) * toRate;
      setConvertedAmount(result);
    } else {
      setConvertedAmount(amount);
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAddConversionToHistory = () => {
    const newConversion = {
      fromCurrency,
      toCurrency,
      amount,
      result: convertedAmount,
    };

    setConversionHistory([...conversionHistory, newConversion]);

    // Mostrar la alerta de conversión exitosa
    setConversionAlert(`Conversión exitosa: ${amount} ${fromCurrency} a ${convertedAmount.toFixed(2)} ${toCurrency}`);
  };

  const handleClearHistory = () => {
    setConversionHistory([]);
  };

  const handlePerformConversion = () => {
    handleAddConversionToHistory();
  };

  return (
    <div className="App">
      <h1>Conversor de Divisas</h1>
      <div className="converter">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <select
          value={fromCurrency}
          onChange={e => setFromCurrency(e.target.value)}
        >
          {exchangeRates &&
            Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
        <span>=</span>
        <input
          type="text"
          value={convertedAmount !== null ? convertedAmount.toFixed(2) : ''}
          readOnly
        />
        <select
          value={toCurrency}
          onChange={e => setToCurrency(e.target.value)}
        >
          {exchangeRates &&
            Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
        <button onClick={handlePerformConversion}>Realizar Conversión</button> <br></br>
        <button onClick={handleSwapCurrencies}>Intercambiar</button><br></br>
        <button onClick={handleClearHistory}>Borrar Historial</button>
      </div>
      <h2>Historial de Conversiones</h2>
      <ul>
        {conversionHistory.map((conversion, index) => (
          <li key={index}>
            {conversion.fromCurrency} a {conversion.toCurrency}: {conversion.amount} = {conversion.result}
          </li>
        ))}
      </ul>
      <Modal
        isOpen={conversionAlert !== null}
        onRequestClose={() => setConversionAlert(null)}
        style={customStyles}
      >
        <h2>Alerta de Conversión</h2>
        <p>{conversionAlert}</p>
        <button onClick={() => setConversionAlert(null)}>Cerrar</button>
      </Modal>
    </div>
  );
}

export default App;
