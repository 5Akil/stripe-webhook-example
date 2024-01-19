import React, { useState } from 'react'
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './form.css'

export default function PaymentForm() {

    const [success, setSuccess] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement)
        })
        console.log(paymentMethod);
        if (!error) {
            try {
                const { id } = paymentMethod
                const response =await fetch("http://localhost:9000/stripePayment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: 100000,
                        id: id
                    }),
                })
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                } else {
                    const responseData = await response.json();
                    const result = await stripe.confirmCardPayment(responseData.client_secret);
                    if (result?.paymentIntent?.status === "succeeded") {
                        console.log('payment id=>' , result?.paymentIntent?.id);
                    }
                }
            } catch (error) {
                console.log("Error", error)
            }
        } else {
            console.log(error.message)
        }
    }
    const CARD_OPTIONS = {
        iconStyle: "solid",
        style: {
            base: {
                iconColor: "#c4f0ff",
                color: "black",
                fontWeight: 500,
                fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                fontSize: "16px",
                fontSmoothing: "antialiased",
                ":-webkit-autofill": { color: "black" },
                "::placeholder": { color: "black" }
            },
            invalid: {
                iconColor: "#ffc7ee",
                color: "black"
            }
        }
    }

    return (
        <>
            {!success ?
                <form onSubmit={handleSubmit}>
                    <fieldset className='FormGroup'>
                        <div className="FormRow">
                            <CardNumberElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <fieldset className='FormGroup'>
                        <div className="FormRow">
                            <CardExpiryElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <fieldset className='FormGroup'>
                        <div className="FormRow">
                            <CardCvcElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <button>Pay</button>
                </form>
                :
                <div className="payment-success">
                    <h2>Payment successful</h2>
                    <h3 className='Thank-you'>Thank you for your patronage</h3>
                </div>
            }
        </>
    )
}
