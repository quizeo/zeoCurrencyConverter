import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const currentDate = new Date().toISOString().split('T')[0];
const port = 3000;
const API = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

let answer = 0;
let currencyName = ""

async function getCurrencyRate(fromCurrency, toCurrency) {
    try {
        const result = await axios.get(`${API}currencies/${fromCurrency}.json`);

        const rate = result.data[fromCurrency];
        const rateValue = rate[toCurrency];
        console.log(rateValue + " rateValue");
        return rateValue;
    } catch (error) {
        console.error("Error fetching the API:", error);
        return null;
    }
}

function calculateAmount(amount, rate) {
    return amount * rate;
}




app.get('/', async (req, res) => { 
    try {
        const result = await axios.get(`${API}currencies.min.json`);
        const currenciesName = result.data;
        console.log(currentDate + " now");
        console.log(answer + " answer amount");
        res.render('index', { currencies: currenciesName , answer: answer ,currencyName: currencyName });
    } catch (error) {
        console.error("Error fetching the API:", error);
        res.status(500).send("Error fetching the API");
    }
});


app.post('/currency', async (req, res) => {
    try {
        const { fromCurrency, toCurrency, amount } = req.body;
        console.log(fromCurrency + " fromCurrency");
        console.log(toCurrency + " toCurrency");
        console.log(amount + " amount");
         const rate = await getCurrencyRate(fromCurrency ,toCurrency);
 
        if (rate) {
            const parsedAmount = parseFloat(amount);
            console.log(`parsedAmount: ${parsedAmount}`);
            answer = calculateAmount(parsedAmount, rate);
            console.log(`answer: ${answer}`);
            currencyName = toCurrency;
            res.redirect('/');
        } else {
            res.status(500).send("Error fetching the conversion rate");
        }
    } catch (error) {
        console.error("Error fetching the API:", error);
        res.status(500).send("Error fetching the API");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});