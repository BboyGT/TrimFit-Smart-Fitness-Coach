import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using the TrimFit mobile application ("App"), website, or any related services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the Services. These Terms constitute a legally binding agreement between you and TrimFit Inc. ("TrimFit," "we," "us," or "our"). We reserve the right to update these Terms at any time, and your continued use of the Services after any changes constitutes acceptance of the revised Terms. We will notify you of material changes via email or in-app notification at least 30 days before they take effect.',
  },
  {
    title: '2. Description of Services',
    content: 'TrimFit provides a smart fitness coaching platform that includes personalized workout plans, exercise libraries, nutrition tracking, progress monitoring, achievement systems, and community features. The Services are available through mobile applications for iOS and Android platforms, as well as through our website. Some features are available for free, while others require a paid subscription. We continuously strive to improve and update the Services, and we reserve the right to modify, suspend, or discontinue any aspect of the Services at any time, with reasonable notice when possible.',
  },
  {
    title: '3. User Accounts',
    content: 'To access certain features of the Services, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 13 years old to create an account. If you are under 18, you represent that your parent or legal guardian has reviewed and agreed to these Terms. You must notify us immediately of any unauthorized use of your account. TrimFit is not liable for any loss or damage arising from your failure to protect your account.',
  },
  {
    title: '4. Subscription Plans & Payment',
    content: 'TrimFit offers multiple subscription tiers: Free, Basic, and Pro. Free tier features are available at no cost. Basic and Pro subscriptions are billed on a monthly or annual basis, as selected during purchase. Subscription fees are non-refundable except as expressly stated in our refund policy or as required by applicable law. All prices are displayed in your local currency where applicable. Taxes may apply based on your jurisdiction. Subscriptions auto-renew at the end of each billing period unless cancelled at least 24 hours before renewal. You can manage your subscription and auto-renewal settings through your account or by contacting our support team.',
  },
  {
    title: '5. Free Trial',
    content: 'We may offer free trial periods for paid subscription plans. During a free trial, you will have access to all features of the selected plan. At the end of the trial period, you will be automatically charged the applicable subscription fee unless you cancel before the trial expires. We will send a reminder notification before your trial converts to a paid subscription. Only one free trial is available per user or per device. We reserve the right to revoke free trial access if we detect abuse or fraudulent activity.',
  },
  {
    title: '6. Refund Policy',
    content: 'We offer a 30-day money-back guarantee on all new subscription purchases. If you are not satisfied with our Services, you may request a full refund within 30 days of your initial purchase by contacting our support team. Refunds for renewal payments are handled on a case-by-case basis. Refunds will be processed within 5-10 business days to your original payment method. Promotional or discounted subscriptions may have different refund terms, which will be communicated at the time of purchase. We do not provide refunds for partially used billing periods.',
  },
  {
    title: '7. Acceptable Use',
    content: 'You agree not to use the Services for any unlawful purpose or in any way that could damage, disable, or impair the Services. You must not attempt to gain unauthorized access to any part of the Services, other accounts, or computer systems. You must not use the Services to transmit harmful, threatening, abusive, or otherwise objectionable content. You must not reproduce, duplicate, sell, or exploit any portion of the Services without our express written permission. We reserve the right to terminate your account and access to the Services for any violation of these terms.',
  },
  {
    title: '8. User Content',
    content: 'You retain ownership of any content you submit, post, or display through the Services ("User Content"), including progress photos, measurements, and community posts. By submitting User Content, you grant TrimFit a worldwide, non-exclusive, royalty-free license to use, reproduce, and process your content solely for the purpose of providing and improving the Services. You represent that you have all necessary rights to the User Content you submit. We are not responsible for any User Content shared by users, and you use community features at your own risk.',
  },
  {
    title: '9. Health & Fitness Disclaimer',
    content: 'The Services are designed for general fitness and wellness purposes only and are not intended as medical advice, diagnosis, or treatment. The workout plans, exercise recommendations, nutrition information, and other content provided through the Services should not be used as a substitute for professional medical advice. Always consult with a qualified healthcare provider before starting any new exercise program, diet, or fitness regimen, especially if you have any pre-existing medical conditions, injuries, or health concerns. TrimFit is not responsible for any injuries, health issues, or adverse effects that may result from your use of the Services.',
  },
  {
    title: '10. Intellectual Property',
    content: 'All content, features, and functionality of the Services, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, software, and the design, selection, and arrangement thereof, are owned by TrimFit Inc., its licensors, or other providers of such material and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from the Services without our prior written consent, except as permitted by applicable law.',
  },
  {
    title: '11. Limitation of Liability',
    content: 'To the fullest extent permitted by applicable law, TrimFit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of, or inability to access or use, the Services. In no event shall our total liability exceed the amount paid by you to TrimFit in the twelve months preceding the claim. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above limitations may not apply to you.',
  },
  {
    title: '12. Contact Information',
    content: 'If you have any questions, concerns, or requests regarding these Terms of Service, please contact us at: TrimFit Inc., Legal Department, Email: legal@trimfit.app, Support: support@trimfit.app. We aim to respond to all inquiries within 48 business hours. For urgent matters, you may also reach us through the in-app support feature. We are committed to resolving any issues promptly and fairly.',
  },
]

const TermsPage = () => {
  const navigate = useNavigate()
  const [expandedSection, setExpandedSection] = useState(null)

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Terms of Service</h1>
            <p className="text-sm text-gray-400">Last updated: May 2025</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 mb-4"
        >
          <p className="text-sm text-gray-300 leading-relaxed">
            These Terms of Service govern your use of the TrimFit application and all related services. By using TrimFit, you agree to these terms. Please read them carefully.
          </p>
        </motion.div>

        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="border border-white/5 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-sm font-medium pr-4">{section.title}</span>
              <ChevronDown
                size={16}
                className={`text-gray-500 shrink-0 transition-transform duration-200 ${expandedSection === i ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedSection === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-sm text-gray-400 leading-relaxed">{section.content}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TermsPage
