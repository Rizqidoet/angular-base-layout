export interface UsersDto {
  id?: string,
  firstName: string,
  lastName: string,
  email: string,
  gender: string,
  address: {
    address: string,
  },
}