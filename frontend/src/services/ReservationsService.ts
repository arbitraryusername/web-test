
import axios from 'axios'
import { Reservation } from '@/models/Reservation'

export class ReservationService {
  static createReservationAsync(reservation: Reservation): Promise<void> { 
    return new Promise((resolve, reject) => {
      axios.post('http://localhost:9090/restaurant/reservations', reservation)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  }

  static getReservationsAsync(): Promise<Reservation[]> { 
    return new Promise((resolve, reject) => {
      axios.get('http://localhost:9090/restaurant/reservations')
        .then(response => {
          const reservations: Reservation[] = response.data
          resolve(reservations)
        })
        .catch(error => reject(error))
    })
  }
}
