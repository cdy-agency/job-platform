// /types/housekeeper.ts

export interface IFileInfo {
  url: string
  name?: string
}

export interface ILocation {
  province?: string
  district?: string
  sector?: string
  cell?: string
  village?: string
}

export interface IHousekeeper {
  _id?: string
  fullName: string
  dateOfBirth: string // ISO string is easier on frontend
  gender: "male" | "female"
  idNumber: string
  phoneNumber: string
  location: ILocation
  workPreferences: {
    language: string
    amountOfMoney: string
    workType: string
    vocationDays: string
    married: string
    numberChildren: string
    willingToWorkWithChildren: boolean
  }
  background: {
    hasParents: boolean
    fatherName?: string
    fatherPhone?: string
    motherName?: string
    motherPhone?: string
    hasStudied: boolean
    educationLevel?: string
    church?: string
  }
  passportImage?: IFileInfo
  fullBodyImage?: IFileInfo
  idImage?: IFileInfo
  status: "available" | "hired" | "inactive"
  createdAt: string
  updatedAt: string
}
