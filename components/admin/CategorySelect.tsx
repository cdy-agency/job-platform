"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JOB_CATEGORIES, JobCategory } from "@/utils/jobCategories"

export default function CategorySelect({ value, onChange, placeholder = "Select category" }: {
  value?: JobCategory | string
  onChange: (val: JobCategory) => void
  placeholder?: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as JobCategory)}>
      <SelectTrigger className="border-gray-300">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {JOB_CATEGORIES.map((c) => (
          <SelectItem key={c} value={c}>{c}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}