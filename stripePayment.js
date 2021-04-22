const rs = require('readline-sync')
const stripe = require('stripe')('sk_test_51Iit1ZSENrXZn823ZEWSHXYT9AREOvZ9uipjQ5ELdIcHfIDKkYi2BFvqYmPYNBe05AjFAp8pND3c8IotOir2JW3700KuWsXQi5');

console.log('Thank you for shopping with us. Your Net Total is $3.60')
console.log('Kindly add your card details to finish checkout. Thank you!')
let cardNumber = rs.question('Enter your card number: ')
let expiryMonth = rs.question('Enter your card expiry month: ')
let expiryYear = rs.question('Enter your card expiry year: ')
let cvcCode = rs.question('Enter your 3 digit CVC Code: ')

createCardToken()


async function createCardToken() {
    try {
        const token = await stripe.tokens.create({
            card: {
                number: cardNumber.split(' ').join(''),
                exp_month: expiryMonth,
                exp_year: expiryYear,
                cvc: cvcCode,
            },
        });
        let tokenID = token.id
        const charge = await stripe.charges.create({
            description: 'Software development services',
            shipping: {
                name: 'Jenny Rosen',
                address: {
                    line1: '510 Townsend St',
                    postal_code: '98140',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                },
            },
            amount: 360,
            currency: 'usd',
            description: 'Sample Purchase',
            source: tokenID,
        });

        let chargeID = charge.id
        console.log('Created card with token id: ' + tokenID)
        console.log('Created charge with id: ' + chargeID)
    } catch (error) {
        console.log(error.raw.message)
        console.log('Payment aborted! Please try again!')
        return
    }
}