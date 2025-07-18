import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - MCPHubs',
  description: 'MCPHubs terms of service and usage guidelines',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Terms of Service
      </h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Acceptance of Terms
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              By accessing and using MCPHubs (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Description of Service
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              MCPHubs is a platform that provides information, resources, and tools related to the Model Context Protocol (MCP). Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Project listings and information from GitHub repositories</li>
              <li>Educational content about MCP technology</li>
              <li>Community features and discussions</li>
              <li>Development tools and resources</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. User Responsibilities
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>As a user of MCPHubs, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to interfere with the proper functioning of the service</li>
              <li>Not use automated tools to access the service excessively</li>
              <li>Respect intellectual property rights</li>
              <li>Provide accurate information when required</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Intellectual Property
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights.
            </p>
            <p>
              Project information displayed on MCPHubs is sourced from publicly available GitHub repositories and remains subject to their respective licenses.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Privacy and Data Collection
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Disclaimers
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, MCPHubs:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Excludes all representations and warranties relating to this website and its contents</li>
              <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
              <li>Does not guarantee the accuracy or completeness of third-party content</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. Limitation of Liability
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              MCPHubs will not be liable for any indirect, special, incidental, or consequential damages arising out of or in connection with your use of the service.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. Advertising
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              MCPHubs displays advertisements through Google AdSense and other advertising networks. We are not responsible for the content of advertisements or the practices of advertisers.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. Termination
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            10. Changes to Terms
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            11. Governing Law
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which MCPHubs operates, without regard to conflict of law provisions.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            12. Contact Information
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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