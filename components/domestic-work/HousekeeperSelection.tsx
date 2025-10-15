"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, MapPin, Calendar } from "lucide-react"
import { ApiHousekeeper } from "./EmployerForm"

interface Props {
  housekeepers: ApiHousekeeper[]
  onConfirm: (selectedIds: string[]) => void
}

export default function HousekeeperSelection({ housekeepers, onConfirm }: Props) {
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [ageFilter, setAgeFilter] = useState<"all" | "18-21" | "22-25" | "26-30" | "31-35" | "36+">("all");
  const [selected, setSelected] = useState<ApiHousekeeper[]>([]);
  const [modal, setModal] = useState<ApiHousekeeper | null>(null);

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const ageMatches = (age: number) => {
    switch (ageFilter) {
      case "18-21": return age >= 18 && age <= 21;
      case "22-25": return age >= 22 && age <= 25;
      case "26-30": return age >= 26 && age <= 30;
      case "31-35": return age >= 31 && age <= 35;
      case "36+": return age >= 36;
      default: return true;
    }
  };

  const filteredHousekeepers = useMemo(() => {
    return housekeepers.filter(h => {
      const age = calculateAge(h.dateOfBirth);
      const genderMatch = genderFilter === "all" || h.gender === genderFilter;
      const ageMatch = ageMatches(age);
      return genderMatch && ageMatch;
    });
  }, [housekeepers, genderFilter, ageFilter]);

  const toggleSelect = (hk: ApiHousekeeper) => {
    if (hk.status !== "available") return; // cannot select unavailable
    if (selected.find(s => s._id === hk._id)) {
      setSelected(selected.filter(s => s._id !== hk._id));
    } else if (selected.length < 2) {
      setSelected([...selected, hk]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters (same as before) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Gender Filter */}
        <div className="flex-1">
          <Label>Filter by Gender</Label>
          <Select onValueChange={v => setGenderFilter(v as any)} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age Filter */}
        <div className="flex-1">
          <Label>Filter by Age</Label>
          <Select onValueChange={v => setAgeFilter(v as any)} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="18-21">18-21</SelectItem>
              <SelectItem value="22-25">22-25</SelectItem>
              <SelectItem value="26-30">26-30</SelectItem>
              <SelectItem value="31-35">31-35</SelectItem>
              <SelectItem value="36+">36+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Housekeeper Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredHousekeepers.length > 0 ? (
          filteredHousekeepers.map(hk => {
            const age = calculateAge(hk.dateOfBirth);
            const isSelected = selected.some(s => s._id === hk._id);
            const isAvailable = hk.status === "available";

            return (
              <Card
                key={hk._id}
                className={`
                  cursor-pointer transition
                  ${isAvailable ? "hover:shadow-md" : "opacity-50 cursor-not-allowed"}
                  ${isSelected ? "border-[#834de3] border-2 bg-purple-50" : "border-gray-200"}
                `}
                onClick={() => toggleSelect(hk)}
              >
                <CardContent className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {hk.fullBodyImage?.url ? (
                      <img src={hk.fullBodyImage.url} alt={hk.fullName} className="w-full h-full object-cover"/>
                    ) : <User className="text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{hk.fullName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {hk.location?.district ?? "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <span>{age} years</span>
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => { e.stopPropagation(); setModal(hk) }}
                      disabled={!isAvailable}
                    >
                      More Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <p className="text-gray-500">No housekeepers match your filters.</p>
        )}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">Selected: {selected.length}/2</p>
        <Button
          onClick={() => onConfirm(selected.map(h => h._id!))}
          disabled={selected.length === 0}
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          Confirm Selection
        </Button>
      </div>

      {/* Modal (same as before) */}
      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-md">
          {modal && (
            <>
              <DialogHeader>
                <DialogTitle>{modal.fullName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <div className="flex justify-center">
                  {modal.fullBodyImage?.url ? (
                    <img src={modal.fullBodyImage.url} alt={modal.fullName} className="w-32 h-32 rounded-full object-cover"/>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="text-gray-500"/>
                    </div>
                  )}
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Gender:</strong> {modal.gender}</p>
                  <p><strong>Age:</strong> {calculateAge(modal.dateOfBirth)}</p>
                  <p><strong>Location:</strong> {modal.location?.sector}, {modal.location?.district}</p>
                  <p><strong>Phone:</strong> {modal.phoneNumber}</p>
                  <p><strong>Work Type:</strong> {modal.workPreferences.workType}</p>
                  <p><strong>Expected Salary:</strong> {modal.workPreferences.amountOfMoney}</p>
                  <p><strong>Marital Status:</strong> {modal.workPreferences.married}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
