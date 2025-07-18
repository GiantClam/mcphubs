import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - MCPHubs',
  description: 'MCPHubs privacy policy and data protection information',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Information We Collect
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              MCPHubs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects information in the following ways:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Analytics Data:</strong> We use Google Analytics to collect anonymous usage statistics to improve our website.</li>
              <li><strong>Cookies:</strong> We use cookies for website functionality and analytics purposes.</li>
              <li><strong>GitHub Data:</strong> We collect publicly available GitHub repository information to display project listings.</li>
              <li><strong>User Authentication:</strong> If you sign in, we store your authentication information securely.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. How We Use Your Information
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and improving our services</li>
              <li>Analyzing website usage and performance</li>
              <li>Displaying relevant content and advertisements</li>
              <li>Ensuring website security and preventing abuse</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Third-Party Services
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites.</li>
              <li><strong>Google Analytics:</strong> We use Google Analytics to analyze website traffic and user behavior.</li>
              <li><strong>GitHub API:</strong> We fetch publicly available repository data from GitHub.</li>
              <li><strong>Vercel:</strong> Our website is hosted on Vercel for performance and reliability.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Advertising
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We use Google AdSense to display advertisements on our website. Google AdSense uses cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Serve ads based on your interests</li>
              <li>Measure ad performance</li>
              <li>Prevent fraud and improve security</li>
            </ul>
            <p>
              You can opt out of personalized ads by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Data Security
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Your Rights
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your personal information</li>
              <li>Right to object to processing</li>
              <li>Right to data portability</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. International Data Transfers
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure adequate protection of your data through appropriate safeguards.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. Children&apos;s Privacy
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. Changes to This Policy
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            10. Contact Us
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              If you have any questions about this privacy policy, please contact us at:
            </p>
            <ul className="list-none space-y-2">
              <li>Email: contact@mcphubs.com</li>
              <li>Website: <a href="https://mcphubs.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://mcphubs.com</a></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 