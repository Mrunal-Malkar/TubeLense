
import Footer from '../component/footer'

const Contact = () => {
  return (<>
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Need help with TubeLense?
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Questions, bugs, payments, or feedback? <br className="hidden sm:block" />
            We're here to help.
          </p>
        </div>

        {/* Primary Contact CTA */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <p>Contact support:</p>
          <a 
            href="mailto:mrunalpmalkar@gmail.com" 
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
           mrunalpmalkar@gmail.com
          </a>
          <p className="text-sm text-gray-500 font-medium">
           mail us at this gmail.
          </p>
          <p className="text-sm text-gray-500">
            We usually respond within <span className="font-semibold text-gray-700">24–48 hours</span>.
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
            How can we help?
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-2xl">🛠️</span>
            <div>
              <h3 className="font-semibold text-gray-900">Technical Issues</h3>
              <p className="text-sm text-gray-600 mt-1">Filtering incorrectly or behaving unexpectedly.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-2xl">💳</span>
            <div>
              <h3 className="font-semibold text-gray-900">Payments & Purchases</h3>
              <p className="text-sm text-gray-600 mt-1">Questions about a purchase, payment, or refund.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-2xl">🔐</span>
            <div>
              <h3 className="font-semibold text-gray-900">Account Issues</h3>
              <p className="text-sm text-gray-600 mt-1">Problems signing in or restoring a purchase.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-gray-900">Feedback & Bugs 🐛</h3>
              <p className="text-sm text-gray-600 mt-1">Have an idea or found something broken? Tell us!</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-left bg-blue-50 text-blue-900 p-6 rounded-xl max-w-2xl mx-auto text-sm">
          <h4 className="font-bold mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Before contacting us regarding a technical issue, please include:
          </h4>
          <ul className="list-disc pl-5 space-y-1 mb-4 text-blue-800">
            <li>The browser you're using</li>
            <li>What you expected to happen vs. what actually happened</li>
            <li>A screenshot, if relevant</li>
            <li>Your TubeLense account email</li>
          </ul>
          <p className="font-semibold text-blue-800 border-t border-blue-200 pt-3 mt-3">
            ⚠️ Please do not send passwords, payment-card numbers, or other sensitive information by email.
          </p>
        </div>

      </div>
    </div>
<Footer/>
  </>
  )
}

export default Contact