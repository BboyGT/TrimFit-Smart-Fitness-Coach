import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, Shield } from 'lucide-react'
import { useState } from 'react'

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly when creating an account, including your name, email address, phone number, age, gender, height, weight, and fitness goals. We also collect data generated through your use of the Services, such as workout history, exercise preferences, nutrition logs, body measurements, progress photos, and achievement data. Additionally, we automatically collect device information, IP address, operating system, app version, usage patterns, and crash data to improve the performance and stability of our Services.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use the information we collect to provide and personalize the Services, including generating customized workout plans, nutrition recommendations, and fitness insights. We use your data to track your progress, calculate health metrics such as BMI and TDEE, and provide achievement rewards. We may use your information to communicate with you about your account, provide customer support, send notifications about updates and features, and respond to your inquiries. We also use aggregated, anonymized data for analytics, research, and improving our Services.',
  },
  {
    title: '3. Information Sharing',
    content: 'We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating the Services, processing payments, sending notifications, and analyzing data. These providers are contractually obligated to protect your information and may only use it for the purposes we specify. We may share anonymized or aggregated data for research and analytics purposes. We may disclose your information if required by law, in response to legal process, or to protect the rights, safety, and security of our users and the public.',
  },
  {
    title: '4. Data Security',
    content: 'We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS/SSL) and at rest, secure authentication protocols, regular security audits, and access controls. We use Stripe for payment processing, which is PCI DSS Level 1 compliant. While we strive to protect your data using commercially reasonable measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee the absolute security of your data, and you acknowledge that you provide your information at your own risk.',
  },
  {
    title: '5. Data Retention',
    content: 'We retain your personal information for as long as your account is active or as needed to provide the Services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain certain information by law or for legitimate business purposes such as resolving disputes, enforcing our agreements, and complying with legal obligations. Anonymized data generated from your usage may be retained indefinitely for analytics purposes. Workout history and progress data are retained for the lifetime of your account to provide continuity of service.',
  },
  {
    title: '6. Your Rights',
    content: 'Depending on your jurisdiction, you may have the following rights regarding your personal data: the right to access your personal information; the right to correct inaccurate data; the right to delete your data; the right to restrict processing of your data; the right to data portability; the right to object to processing; and the right to withdraw consent. You can exercise these rights through your account settings or by contacting our support team. We will respond to legitimate requests within 30 days. Certain data may be exempt from deletion requests as permitted by law.',
  },
  {
    title: '7. Cookies & Tracking',
    content: 'Our Services may use cookies, local storage, and similar tracking technologies to enhance your experience, remember your preferences, and analyze usage patterns. We use essential cookies required for the Services to function properly. Analytics cookies help us understand how users interact with our Services and improve our offerings. You can manage your cookie preferences through your device or browser settings. Please note that disabling certain cookies may affect the functionality of the Services.',
  },
  {
    title: '8. Third-Party Services',
    content: 'Our Services may integrate with or contain links to third-party services, including payment processors (Stripe), social media platforms (Google, Facebook, Apple, X), and analytics providers. These third-party services have their own privacy policies that govern their collection and use of your information. We encourage you to review the privacy policies of any third-party services you access through our Services. We are not responsible for the privacy practices of third-party services.',
  },
  {
    title: '9. Children\'s Privacy',
    content: 'TrimFit is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information promptly. If you are a parent or guardian and believe your child has provided us with personal information, please contact us and we will take appropriate action. Users between 13 and 18 years of age should have parental consent before using the Services.',
  },
  {
    title: '10. International Data Transfers',
    content: 'Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your jurisdiction. When we transfer data internationally, we implement appropriate safeguards, including standard contractual clauses approved by relevant authorities, to ensure your data receives an adequate level of protection. By using our Services, you consent to the transfer of your information to countries with potentially different data protection standards.',
  },
  {
    title: '11. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. We will notify you of material changes by posting the updated policy within the Services, sending an email notification, or displaying a prominent notice. We encourage you to review this Privacy Policy periodically. Your continued use of the Services after any changes to this Privacy Policy constitutes your acceptance of the revised policy.',
  },
  {
    title: '12. Contact Us',
    content: 'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: TrimFit Inc., Privacy Team, Email: privacy@trimfit.app, Support: support@trimfit.app, Data Protection Officer: dpo@trimfit.app. We are committed to addressing your privacy concerns promptly and transparently. For GDPR-related requests, we will respond within 30 days as required by regulation.',
  },
]

const PrivacyPage = () => {
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
            <h1 className="text-xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-gray-400">Last updated: May 2025</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mb-4 flex items-start gap-3"
        >
          <Shield size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Your privacy matters to us. This policy explains how TrimFit collects, uses, and protects your personal data when you use our fitness coaching Services.
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

export default PrivacyPage
