"use client"

import { useState } from "react"
import HousekeeperForm from "./HouseKeeperForm"
import EmployerForm from "./EmployerForm"

export default function TabsForm() {
  const [active, setActive] = useState<"housekeeper" | "employer">("housekeeper")

  return (
    <div className="w-full">
      {/* Tab headers styled like pills */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 p-2 rounded-full flex space-x-4">
          <button
            onClick={() => setActive("housekeeper")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              active === "housekeeper"
                ? "bg-[#834de3] text-white shadow"
                : "text-gray-600 hover:text-[#834de3]"
            }`}
          >
            Housekeeper
          </button>
          <button
            onClick={() => setActive("employer")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              active === "employer"
                ? "bg-[#834de3] text-white shadow"
                : "text-gray-600 hover:text-[#834de3]"
            }`}
          >
            Employer
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto">
        {active === "housekeeper" && <HousekeeperForm />}
        {active === "employer" && <EmployerForm />}
      </div>
    </div>
  )
}
