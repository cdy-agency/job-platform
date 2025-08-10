export default function CompanyUseSection() {
  return (
    <section className="bg-white py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left content */}
        <div>
          <div className="text-4xl font-bold text-gray-900 mb-4">
            Empower Your Hiring with <span className="text-purple-600">Akazi-Link</span>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Post jobs, review applications, and connect with top talent faster than ever. 
            Our streamlined process helps you focus on finding the perfect fit for your team.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li>- Post your openings in minutes</li>
            <li>- Reach thousands of qualified candidates</li>
            <li>- Track applicants in one easy dashboard</li>
          </ul>
        </div>

        {/* Right visual mockup */}
        <div className="relative">
          <div className="bg-white border border-gray-200 rounded shadow-lg h-64 overflow-hidden">
            <img src="/hhh.webp" alt="image for companies" className="w-full h-full object-cover"/>
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-8 -left-10 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-48">
            <h4 className="font-semibold text-gray-900 text-sm">You Can start Now</h4>
            <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-semibold shadow-lg">
            Get Started
          </button>
          </div>
        </div>

      </div>
    </section>
  );
}
