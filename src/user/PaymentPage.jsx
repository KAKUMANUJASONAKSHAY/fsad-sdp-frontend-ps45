import { useState } from 'react'
import axiosClient from '../api/axiosClient'

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existing = document.querySelector('script[data-razorpay="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true })
      existing.addEventListener('error', () => resolve(false), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpay = 'true'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

function PaymentPage() {
  const student = JSON.parse(sessionStorage.getItem('loggedInStudent') || '{}')
  const [amount, setAmount] = useState(500)
  const [receipt, setReceipt] = useState(`receipt_${Date.now()}`)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const startPayment = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage('')
      setError('Enter a valid payment amount.')
      return
    }

    try {
      setLoading(true)
      const scriptReady = await loadRazorpayScript()

      if (!scriptReady) {
        throw new Error('Razorpay checkout could not be loaded.')
      }

      const orderResponse = await axiosClient.post('/payment/createorder', {
        amount: Number(amount),
        receipt,
      })

      const { key, orderId, currency, amount: orderAmount } = orderResponse.data

      const options = {
        key,
        amount: orderAmount,
        currency,
        order_id: orderId,
        name: 'Student Achievement Portal',
        description: 'Achievement verification fee',
        prefill: {
          name: student.name || '',
          email: student.email || '',
          contact: student.contact || '',
        },
        theme: {
          color: '#b85c38',
        },
        handler: async (response) => {
          try {
            const verifyResponse = await axiosClient.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            setMessage(verifyResponse.data)
            setError('')
          } catch (verifyError) {
            setMessage('')
            setError(
              typeof verifyError.response?.data === 'string'
                ? verifyError.response.data
                : 'Payment verification failed.',
            )
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        setMessage('')
        setError(response.error?.description || 'Payment failed.')
        setLoading(false)
      })
      razorpay.open()
    } catch (err) {
      setMessage('')
      setError(typeof err.response?.data === 'string' ? err.response.data : err.message || 'Unable to start payment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Payment</p>
          <h2>Verification Fee</h2>
        </div>
      </div>

      <p className="section-lead">
        Create a Razorpay order, complete payment securely, and verify the payment with the backend.
      </p>

      {message && <p className="status-banner status-success">{message}</p>}
      {error && <p className="status-banner status-error">{error}</p>}

      <div className="form-grid">
        <label className="field">
          <span>Amount (INR)</span>
          <input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>

        <label className="field">
          <span>Receipt</span>
          <input type="text" value={receipt} onChange={(event) => setReceipt(event.target.value)} />
        </label>

        <button type="button" className="btn btn-primary form-submit" disabled={loading} onClick={startPayment}>
          {loading ? 'Processing...' : 'Pay with Razorpay'}
        </button>
      </div>
    </section>
  )
}

export default PaymentPage
