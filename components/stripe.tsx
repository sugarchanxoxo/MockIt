"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe("pk_test_placeholder")

export function Stripe({ children, options, className }) {
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // This would normally fetch from your API to create a payment intent
    // For demo purposes, we're just simulating it
    setTimeout(() => {
      setClientSecret("pi_simulated_secret_12345")
    }, 1000)
  }, [])

  return (
    <div className={className}>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          {children}
        </Elements>
      )}
      {!clientSecret && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}

