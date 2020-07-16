export class Reservation {
  name: string
  email: string
  partySize: number
  date: Date

  constructor(name: string, email: string, partySize: number, date: Date) {
    this.name = name
    this.email = email
    this.partySize = partySize
    this.date = date
  }
}
