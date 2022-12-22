export enum Gender {
  Male = 'male',
  Female = 'female',
  NonBinary = 'non-binary'
}

export interface UserDB {
  username: string
  firstname: string
  lastname: string
  prefer_lastname: string
  gender: Gender
}
