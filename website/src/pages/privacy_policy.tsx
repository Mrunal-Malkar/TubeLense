import React from 'react'
import Footer from '../component/footer'

const Privacy_Policy = () => {
  return (
  <>
 <div className="text-lg max-w-4xl mx-auto p-6 space-y-4 text-gray-800">
  <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
  
  <p className="mb-6"><strong>Last Updated:</strong> August 27, 2026</p>

  <p>TubeLense ("TubeLense," "we," "us," or "our") operates the TubeLense website and Chrome extension (collectively, the "Service").</p>

  <p>This Privacy Policy explains what personal information we collect, how and why we use it, when and with whom it is shared, how long we keep it, and the rights and choices available to you.</p>

  <p>By installing, accessing, or using TubeLense, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with it, please do not use the Service.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>

  <h3 className="text-xl font-semibold mt-6 mb-2">1.1 Account Information</h3>
  <p>If you sign in to TubeLense using Google, we receive certain information from Google through the authentication process, which may include:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>Your name</li>
    <li>Your email address</li>
    <li>Your Google account identifier</li>
    <li>Profile information made available to us through Google's authentication flow</li>
  </ul>
  <p>We use this information solely to create, identify, and manage your TubeLense account and to associate your account with your purchases and entitlements.</p>

  <h3 className="text-xl font-semibold mt-6 mb-2">1.2 Payment Information</h3>
  <p>Payment processing for TubeLense purchases is handled by our third-party payment processor, <strong>Dodo Payments</strong>.</p>
  <p>Dodo Payments may collect information necessary to process your payment, which may include:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>Name</li>
    <li>Email address</li>
    <li>Phone number</li>
    <li>Billing address</li>
    <li>Payment method details</li>
    <li>Transaction and payment identifiers</li>
    <li>Currency and transaction amount</li>
  </ul>
  <p><strong>We do not collect, process, or store your full payment card details.</strong> These are handled directly by Dodo Payments in accordance with applicable card-network and payment-security standards (e.g., PCI DSS).</p>
  <p>We may receive and store limited transaction metadata from Dodo Payments, such as a payment identifier, transaction amount, currency, payment status, and the account associated with the purchase, for the purpose of granting and verifying access to paid features.</p>
  <p>Dodo Payments' own privacy practices are governed by their privacy policy, available at: <br/>
  <strong><a href="https://dodopayments.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://dodopayments.com/legal/privacy-policy</a></strong></p>

  <h3 className="text-lg font-semibold mt-6 mb-2">1.2.1 RBI Compliance — Storage of Payment System Data</h3>
  <p>In accordance with the Reserve Bank of India's directive on the <strong>Storage of Payment System Data</strong> (RBI/2017-18/153, and subsequent guidelines applicable to payment aggregators/gateways), we do not store any full card number, CVV, card expiry date, or other sensitive card credential on our own servers, systems, or databases, in any form.</p>
  <p>All such sensitive payment data is collected, processed, and stored exclusively by our payment processor, <strong>Dodo Payments</strong>, which is responsible for compliance with applicable RBI guidelines on payment aggregators and payment gateways, and with PCI-DSS card security standards, as part of its own regulatory obligations.</p>
  <p>We only receive and retain non-sensitive transaction metadata from Dodo Payments (such as a payment/transaction ID, payment status, amount, currency, and timestamp) strictly to confirm your purchase and grant access to paid features. This metadata cannot be used to reconstruct your card or bank details.</p>
  <p>If you are a resident of India, note that:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>Your payment data, to the extent processed by our payment processor for a payment transaction, is required under RBI guidelines to be stored only in India (data localisation), where the payment processor is regulated as such.</li>
    <li>We encourage you to review Dodo Payments' privacy policy and RBI-related disclosures directly for details on how they store and secure your payment data: <strong><a href="https://dodopayments.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://dodopayments.com/legal/privacy-policy</a></strong></li>
  </ul>

  <h3 className="text-xl font-semibold mt-6 mb-2">1.3 Information Stored in Your TubeLense Account</h3>
  <p>We may store the following information in connection with your TubeLense account:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>Your Supabase user ID</li>
    <li>Email address</li>
    <li>Account creation date</li>
    <li>Purchase and subscription status</li>
    <li>Lifetime-access status, where applicable</li>
    <li>Payment history and transaction records (limited to the metadata described in Section 1.2)</li>
  </ul>

  <h3 className="text-xl font-semibold mt-6 mb-2">1.4 Extension Data and Preferences</h3>
  <p>TubeLense stores information necessary for the operation and configuration of the extension, such as your selected content topics, filtering preferences, and extension settings.</p>
  <p>Where technically possible, this information is stored <strong>locally</strong> in your browser/extension environment and is not transmitted to our servers unless synchronization of settings across devices is a feature you have enabled.</p>

  <h3 className="text-xl font-semibold mt-6 mb-2">1.5 YouTube Content Analysis</h3>
  <p>TubeLense analyzes information associated with YouTube videos (such as titles, descriptions, thumbnails, and/or on-screen content, depending on the feature) in order to perform its content-filtering functionality.</p>
  <p>This analysis is performed <strong>on your device</strong>, using locally running machine-learning models.</p>
  <p><strong>We do not transmit the YouTube content analyzed by TubeLense to our servers</strong> for the purpose of performing classification or filtering. No copy of the video content, transcript, or analysis output is retained by us.</p>

  <h3 className="text-xl font-semibold mt-6 mb-2">1.6 Automatically Collected Technical Information</h3>
  <p>To operate, secure, and troubleshoot the Service, we may automatically process limited technical information, such as:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>Browser type and version</li>
    <li>Extension version</li>
    <li>Error and crash logs</li>
    <li>General device/operating system information</li>
  </ul>
  <p>This information is used strictly for debugging, security, and reliability purposes and is not used to build advertising profiles or track you across unrelated websites.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">2. Legal Basis for Processing</h2>

  <h3 className="text-xl font-semibold mt-6 mb-2">2.1 India — Digital Personal Data Protection Act, 2023 (DPDP Act)</h3>
  <p>TubeLense is operated from India, and we process personal data as a "Data Fiduciary" under the Digital Personal Data Protection Act, 2023 ("DPDP Act") and its applicable rules. Under the DPDP Act, we process your personal data on the following grounds:</p>
  <ul className="list-disc pl-6 mb-4 space-y-2">
    <li><strong>Consent</strong> — For most processing (e.g., account creation via Google Sign-In, storing your preferences, processing payments), we rely on your free, specific, informed, and unambiguous consent, given when you sign up for or use TubeLense. You have the right to withdraw this consent at any time, with the same ease with which it was given, by contacting us at <a href="mailto:mrunalpmalkar@gmail.com" className="text-blue-600 hover:underline">mrunalpmalkar@gmail.com</a>. Withdrawal does not affect the lawfulness of processing carried out before withdrawal, and may result in loss of access to your account or purchased features.</li>
    <li><strong>Legitimate uses</strong> — Where permitted under Section 7 of the DPDP Act, we may process personal data without consent for purposes such as compliance with a legal obligation, responding to a medical emergency, or performing a function under law, to the extent applicable.</li>
    <li>We collect only the personal data reasonably necessary for the specified purposes described in this Policy ("data minimisation"), and we do not use your data for any purpose beyond what you were informed of at the time of collection ("purpose limitation"), except where you separately consent or where the law permits.</li>
  </ul>
  <p>As a Data Fiduciary, we are responsible for ensuring that any Data Processor (e.g., Supabase, Dodo Payments, Google) engaged on our behalf processes personal data only under a valid contract and in accordance with our instructions and the DPDP Act.</p>

  <h3 className="text-xl font-semibold mt-6 mb-2">2.2 EEA/UK Users</h3>
  <p>If you are located in the European Economic Area (EEA), United Kingdom, or another jurisdiction with similar requirements, we additionally process your personal information under the following legal bases:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li><strong>Performance of a contract</strong> — to create your account, provide the Service, and fulfill purchases.</li>
    <li><strong>Legitimate interests</strong> — to secure the Service, prevent fraud, and maintain reliability, provided these interests are not overridden by your rights.</li>
    <li><strong>Legal obligation</strong> — to comply with tax, accounting, or other applicable laws.</li>
    <li><strong>Consent</strong> — where we rely on your consent (e.g., certain optional features), you may withdraw it at any time without affecting the lawfulness of processing carried out before withdrawal.</li>
  </ul>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Information</h2>
  <p>We use the information we collect to:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>Provide, operate, and maintain TubeLense</li>
    <li>Authenticate users and manage accounts</li>
    <li>Process, verify, and fulfill purchases</li>
    <li>Maintain payment and transaction records</li>
    <li>Provide access to purchased or lifetime features</li>
    <li>Respond to support requests and communications</li>
    <li>Detect, investigate, and prevent fraud, abuse, or unauthorized access</li>
    <li>Maintain and improve the security, stability, and reliability of the Service</li>
    <li>Comply with applicable legal, regulatory, or tax obligations</li>
  </ul>
  <p><strong>We do not use your personal information for behavioral advertising, and we do not sell or rent your personal information to third parties.</strong></p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">4. Analytics and Tracking</h2>
  <p>TubeLense does not currently use third-party analytics, advertising trackers, tracking pixels, or behavioral advertising technologies on the website or within the extension.</p>
  <p>We do not intentionally track your browsing activity across unrelated websites for advertising purposes.</p>
  <p>If this changes in the future (e.g., we introduce privacy-respecting product analytics), we will update this Privacy Policy accordingly before doing so.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">5. How We Share Information</h2>
  <p>We do not sell your personal information.</p>
  <p>We may share or disclose information only where reasonably necessary to:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>Provide and operate the Service</li>
    <li>Process transactions</li>
    <li>Maintain our infrastructure</li>
    <li>Comply with legal obligations</li>
    <li>Protect the rights, property, or safety of TubeLense, our users, or others</li>
  </ul>
  
  <p>Our service providers (each acting as an independent controller or processor, as applicable) include:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li><strong>Google</strong> — provides authentication services when you sign in using your Google account.</li>
    <li><strong>Supabase</strong> — provides authentication, database, and backend infrastructure used to operate parts of TubeLense.</li>
    <li><strong>Dodo Payments</strong> — processes payments and handles payment-related and billing information necessary to complete transactions. See: <a href="https://dodopayments.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://dodopayments.com/legal/privacy-policy</a></li>
  </ul>

  <p>These providers process information under their own privacy policies and terms, and we encourage you to review them.</p>
  <p>We may also disclose information:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>When required by applicable law, regulation, legal process, subpoena, or governmental request</li>
    <li>When reasonably necessary to enforce our terms, protect our rights, or investigate potential violations</li>
    <li>In connection with a merger, acquisition, financing, or sale of assets, subject to standard confidentiality protections and continued application of this Privacy Policy (or a materially similar policy) to your information</li>
  </ul>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Retention</h2>
  <p>We retain account information for as long as your TubeLense account remains active or as reasonably necessary to provide the Service.</p>
  <p>We may retain transaction and payment metadata for longer periods where necessary for accounting, tax, fraud-prevention, dispute-resolution, or legal-compliance purposes, consistent with applicable law.</p>
  <p>If you request account deletion, we will delete or anonymize personal information that we are not legally required or permitted to retain, generally within 30 days of a verified request, unless a longer period is required by law.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">7. Account and Data Deletion</h2>
  <p>You may request deletion of your TubeLense account and associated personal information at any time by contacting:</p>
  <p><strong>Email:</strong> <a href="mailto:mrunalpmalkar@gmail.com" className="text-blue-600 hover:underline">mrunalpmalkar@gmail.com</a></p>
  <p>When we receive a valid deletion request, we will take reasonable steps to verify your identity and then delete or anonymize your personal information, subject to information we are legally required or reasonably permitted to retain (see Section 6).</p>
  <p>Deleting your account may result in the permanent loss of access to TubeLense features, including previously purchased or lifetime-access features, associated with that account.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">8. Data Security</h2>
  <p>We implement reasonable technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction, including relying on reputable infrastructure providers (Google, Supabase, Dodo Payments) that maintain their own security safeguards.</p>
  <p>However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials and for any activity that occurs under your account.</p>
  <p>If we become aware of a data breach affecting your personal information, we will notify you and/or relevant authorities as required by applicable law.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">9. International Data Transfers</h2>
  <p>TubeLense and its service providers may process or store your information in countries other than the one in which you reside, including the United States and other jurisdictions where our infrastructure or payment providers operate.</p>
  <p>Under the Digital Personal Data Protection Act, 2023, transfer of personal data outside India is permitted by default, except to countries or territories that may be specifically restricted by the Central Government of India by notification. We will comply with any such restrictions as and when notified.</p>
  <p>Where required by other applicable law (such as the GDPR), we and our providers rely on appropriate safeguards for such transfers, which may include Standard Contractual Clauses, adequacy decisions, or equivalent legal mechanisms. As noted in Section 1.2.1, payment data handled by our payment processor is subject to RBI data-localisation requirements and is stored within India by that processor, regardless of any broader cross-border transfer of other information. You may contact us for more information about these safeguards.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">10. Children's Privacy</h2>
  <p>TubeLense is not directed to, and is not intended for use by, children under the age of 13 (or the minimum age required by applicable local law, if higher, e.g., 16 in certain EEA member states).</p>
  <p>We do not knowingly collect personal information from children in violation of applicable law. If we become aware that we have inadvertently collected personal information from a child in violation of this policy, we will take reasonable steps to delete such information promptly.</p>
  <p>If you believe a child has provided us with personal information without appropriate parental or guardian consent, please contact us at <a href="mailto:mrunalpmalkar@gmail.com" className="text-blue-600 hover:underline">mrunalpmalkar@gmail.com</a> so we can investigate and take appropriate action.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">11. Third-Party Services</h2>
  <p>TubeLense relies on the following third-party services to provide authentication, infrastructure, and payment processing:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li><strong>Google</strong> — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a></li>
    <li><strong>Supabase</strong> — <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://supabase.com/privacy</a></li>
    <li><strong>Dodo Payments</strong> — <a href="https://dodopayments.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://dodopayments.com/legal/privacy-policy</a></li>
  </ul>
  <p>These third parties operate independently, and their processing of your information is governed by their own privacy policies. We encourage you to review these policies. We are not responsible for the privacy practices of these independent third parties beyond our obligations under applicable law.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">12. Your Privacy Rights</h2>
  <p>Depending on your location and applicable law (including the GDPR, UK GDPR, and U.S. state privacy laws such as the CCPA/CPRA), you may have some or all of the following rights regarding your personal information:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li><strong>Right to access</strong> — request a copy of the personal information we hold about you</li>
    <li><strong>Right to rectification</strong> — request correction of inaccurate or incomplete information</li>
    <li><strong>Right to deletion/erasure</strong> — request deletion of your personal information</li>
    <li><strong>Right to restriction</strong> — request that we limit how we process your information</li>
    <li><strong>Right to object</strong> — object to certain types of processing, including processing based on legitimate interests</li>
    <li><strong>Right to data portability</strong> — request a copy of certain information in a structured, commonly used, machine-readable format</li>
    <li><strong>Right to withdraw consent</strong> — where processing is based on consent, withdraw it at any time</li>
    <li><strong>Right to non-discrimination</strong> — you will not be discriminated against for exercising your privacy rights (applicable to California residents under the CCPA/CPRA)</li>
    <li><strong>Right to lodge a complaint</strong> — with your local data protection authority (EEA/UK residents) or applicable regulator</li>
  </ul>
  <p>To exercise any of these rights, contact us at:</p>
  <p><strong>Email:</strong> <a href="mailto:mrunalpmalkar@gmail.com" className="text-blue-600 hover:underline">mrunalpmalkar@gmail.com</a></p>
  <p>We may need to verify your identity before fulfilling certain requests, and we will respond within the timeframe required by applicable law (typically 30 days, extendable where permitted).</p>
  <p>We do not use automated decision-making or profiling that produces legal or similarly significant effects on you.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">13. Do Not Track</h2>
  <p>Some browsers offer a "Do Not Track" (DNT) signal. Because there is no common industry standard for interpreting DNT signals, TubeLense does not currently respond to them. As noted in Section 4, we do not track your activity across unrelated third-party websites for advertising purposes regardless of DNT settings.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">14. Changes to This Privacy Policy</h2>
  <p>We may update this Privacy Policy from time to time to reflect changes to TubeLense, our services, technology, or applicable legal requirements.</p>
  <p>When we make material changes, we will update the "Last Updated" date at the top of this policy and, where required by applicable law, provide additional notice (such as an in-extension notification or email).</p>
  <p>Your continued use of TubeLense after an updated Privacy Policy takes effect constitutes your acceptance of the updated policy, to the extent permitted by applicable law.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">15. Governing Law and Jurisdiction</h2>
  <p>This Privacy Policy is governed by, and shall be construed in accordance with, the laws of India, including but not limited to:</p>
  <ul className="list-disc pl-6 mb-4 space-y-1">
    <li>The Digital Personal Data Protection Act, 2023, and its rules</li>
    <li>The Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
    <li>Reserve Bank of India (RBI) directions applicable to payment aggregators, payment gateways, and storage of payment system data, to the extent applicable to our payment processor</li>
  </ul>
  <p>Subject to Section 16 (Grievance Officer) below, any disputes arising out of or in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the courts located in India, without prejudice to any mandatory consumer-protection or data-protection rights you may have under the law of your own country of residence, where applicable (e.g., for EEA/UK or U.S. residents).</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">16. Grievance Officer (India)</h2>
  <p>In accordance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023, we have designated a Grievance Officer to address complaints or concerns regarding the processing of your personal data.</p>
  <p>
    <strong>Grievance Officer:</strong> Mrunal Malkar<br />
    <strong>Email:</strong> <a href="mailto:mrunalpmalkar@gmail.com" className="text-blue-600 hover:underline">mrunalpmalkar@gmail.com</a>
  </p>
  <p>Any complaint or grievance regarding this Privacy Policy, or the processing of your personal data, may be addressed to the Grievance Officer. We will acknowledge and address grievances in accordance with the timelines prescribed under applicable Indian law (generally, acknowledgement within 48 hours and resolution within 15 to 30 days, as applicable).</p>
  <p>If you are not satisfied with our response, you may have the right to file a complaint with the Data Protection Board of India (once constituted and operational under the DPDP Act) or other applicable regulatory authority.</p>

  <hr className="my-8 border-gray-300" />

  <h2 className="text-2xl font-bold mt-8 mb-4">17. Contact Us</h2>
  <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at:</p>
  <p>
    <strong>TubeLense</strong><br />
    <strong>Email:</strong> <a href="mailto:mrunalpmalkar@gmail.com" className="text-blue-600 hover:underline">mrunalpmalkar@gmail.com</a>
  </p>
</div>
<Footer/>
</>
  )
}

export default Privacy_Policy