import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from './PaymentForm';
const stripePromise = loadStripe("pk_test_51O5nxNIYYpj5fzgmm6rN2yF3725sXVY9QN7RKYzClaltPDzwsAJzJS2Si5RyAoYyg78ESlX4sRCKDiR3xPOU16tC0047fgPcdA")
// const stripePromise = loadStripe("pk_test_51O7BXqApJs7Uj1biXfUXV7KC7JSzL8ITyRmZ42jBCnmNZUud1fD9KQDkUn8zP3nCsGjeJIFjMMaI9fKTqSWu4T8700AR8KBR3D")

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </>
  )
}

export default App
  