// import { useState } from "react";

// const ApplicationForm = ({ job, onCancel }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     coverLetter: '',
//     resume: null
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Application submitted for ${job.title}!`);
//     onCancel();
//   };

//   return (
//     <div className="bg-white rounded-xl border p-8">
//       <h2 className="text-xl font-bold text-gray-900 mb-6">Apply for {job.title}</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid gap-4 md:grid-cols-2">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//             <input
//               type="text"
//               required
//               className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               placeholder="Enter your full name"
//               value={formData.fullName}
//               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             <input
//               type="email"
//               required
//               className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               placeholder="your.email@example.com"
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
//           <textarea
//             rows={6}
//             required
//             className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             placeholder="Tell us why you're perfect for this role..."
//             value={formData.coverLetter}
//             onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
//             <p className="text-gray-600">Drop your resume here or click to browse</p>
//             <input 
//               type="file" 
//               className="mt-2 text-sm text-gray-500"
//               accept=".pdf,.doc,.docx"
//               onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
//             />
//           </div>
//         </div>
//         <div className="flex gap-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button 
//             type="submit"
//             className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//           >
//             Submit Application
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };