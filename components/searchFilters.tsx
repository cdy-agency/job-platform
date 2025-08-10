// import { Grid, List } from "lucide-react";

// const SearchFilters = ({ 
//   searchTerm, 
//   setSearchTerm, 
//   category, 
//   setCategor
//   jobType, 
//   setJobType, 
//   location, 
//   setLocation,
//   viewMode,
//   setViewMode 
// }) => {
//   return (
//     <div className="bg-white rounded-lg border p-4 mb-4">
//       <div className="grid gap-4 md:grid-cols-4 mb-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
//           <input
//             type="text"
//             placeholder="Search jobs..."
//             className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
//         >
//           <option value="all">All Categories</option>
//           <option value="Technology">Technology</option>
//           <option value="Marketing">Marketing</option>
//           <option value="Design">Design</option>
//         </select>
//         <select
//           value={jobType}
//           onChange={(e) => setJobType(e.target.value)}
//           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
//         >
//           <option value="all">All Types</option>
//           <option value="fulltime">Full Time</option>
//           <option value="part-time">Part Time</option>
//           <option value="internship">Internship</option>
//         </select>
//         <select
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
//         >
//           <option value="all">All Locations</option>
//           <option value="Remote">Remote</option>
//           <option value="Kigali">Kigali</option>
//         </select>
//       </div>
      
//       {setViewMode && (
//         <div className="flex justify-end">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setViewMode('grid')}
//               className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:text-gray-800'}`}
//             >
//               <Grid className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:text-gray-800'}`}
//             >
//               <List className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };