export class CustomerSettingsService {
  // TODO: these values should come from the Restaurant table (if it had these values) and should be cached for the session. For convenience I am just hard-coding these.
  static readonly defaultInventory: number = 2 // allow a maximum of 2 reservations per 15 minute block
  static readonly maxPartySize: number = 6 // allow a maximum of 6 guests per reservation 
  static readonly openingHour: number = 17 // restaurant opens at 5 PM
  static readonly closingHour: number = 24 // restaurant closes at midnight
  static readonly reservationDaysAvailable: number = 4 // number of days in advance a reservation can be made not including today (so 0 would mean only reservations can be made for today)
  static readonly reservationInvervalInMinutes: number = 15 // reservations can only be made in 15 minute increments

  static getDefaultInventory(): number {
    return this.defaultInventory
  }

  static getMaxPartySize(): number {
    return this.maxPartySize
  }

  static getReservationDaysAvailable(): number {
    return this.reservationDaysAvailable
  }

  static getOpeningHour(): number {
    return this.openingHour
  }

  static getClosingHour(): number {
    return this.closingHour
  }

  static getReservationIntervalInMinutes(): number {
    return this.reservationInvervalInMinutes
  }
}
