<template>
  <div>
    <h1>Reservations</h1>

    <div>Total reservations count: {{ savedReservations.length }}</div>
    <br />

    <label>Name </label>
    <input v-model="reservation.name" />
    <br />

    <label>Email </label>
    <input v-model="reservation.email" />
    <br />

    <label>Party Size </label>
    <select v-model="reservation.partySize">
      <option v-for="size in allowedPartySizes" :key="size">
        {{ size }}
      </option>
    </select>
    <br />

    <label>Date </label>
    <select v-model="selectedDate">
      <option v-for="(date, index) in availableDates" :key="index">
        {{ getFormattedDate(date) }}
      </option>
    </select>
    <br />

    <label>Time </label>
    <select v-model="selectedTime">
      <option v-for="(time, index) in availableTimes" :key="index">
        {{ getFormattedTime(time) }}
      </option>
    </select>
    <br />

    <br />
    <button @click="addReservationAsync">Add Reservation</button>
  </div>
</template>

<script lang="ts">
import { Reservation } from '../models/Reservation'
import { CustomerSettingsService } from '../services/CustomerSettingsService'
import { ReservationService } from '../services/ReservationsService'

export default {
  name: 'Reservations',
  data: function() {
    return {
      reservation: {} as Reservation,
      selectedDate: null as Date,
      selectedTime: null as Date,
      savedReservations: [] as Reservation[]
    }
  },
  computed: {
    allowedPartySizes: function(): number[] {
      const maxPartySize = CustomerSettingsService.getMaxPartySize()
      const allowedPartySizes: number[] = []
      for (let i = 1; i <= maxPartySize; i++) {
        allowedPartySizes.push(i)
      }
      return allowedPartySizes
    },
    availableDates: function(): Date[] {
      const now = new Date()
      const availableDates: Date[] = [now]
      const maxDaysAvailable = CustomerSettingsService.getReservationDaysAvailable()

      for (let i = 1; i <= maxDaysAvailable; i++) {
        const date = new Date()
        date.setTime(now.getTime() + i * 24 * 60 * 60 * 1000)
        availableDates.push(date)
      }

      return availableDates
    },
    availableTimes: function(): Date[] {
      if (!this.selectedDate) {
        return []
      }

      const now = new Date()
      const nextIntervalStartMinute = ((Math.floor(now.getMinutes() / 15) + 1) * 15); // current time rounded up to nearest 15 minute interval
      const openingHour = CustomerSettingsService.getOpeningHour()

      let startHour = now.getHours() > openingHour ? now.getHours() : openingHour
      let startMinute = now.getHours() > openingHour ? nextIntervalStartMinute : 0 
      if (startMinute === 60) {
        startHour++
        startMinute = 0
      }
      
      const reservationDate = new Date(this.selectedDate)
      reservationDate.setHours(startHour)
      reservationDate.setMinutes(startMinute) 
      reservationDate.setSeconds(0)
      reservationDate.setMilliseconds(0)

      const maxInventory = CustomerSettingsService.getDefaultInventory() // TODO: this could be different for each 15 minute interval
      const closingHour = CustomerSettingsService.getClosingHour()
      const intervalInHours = CustomerSettingsService.getReservationIntervalInMinutes() / 60.0

      const availableTimes: Date[] = []

      for (let h = startHour; h < closingHour; h += intervalInHours) {
        const reservationsAtThisTime = this.savedReservations.filter((reservation: Reservation) => {
          const date = new Date(reservation.date)
          return date.getTime() === reservationDate.getTime()
        })

        if (reservationsAtThisTime.length < maxInventory) {
          availableTimes.push(new Date(reservationDate))
        }

        reservationDate.setTime(reservationDate.getTime() + intervalInHours * 60 * 60 * 1000)
      }

      return availableTimes
    }
  },
  methods: {
    getFormattedDate(date: Date): string {
      return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
    },
    getFormattedTime(date: Date): string {
      return `${date.getHours()}:${date.getMinutes()}`
    },
    resetFormData(): void {
      this.reservation = new Reservation(null, null, 1, null)
      this.selectedDate = null
      this.selectedTime = null
    },
    addReservationAsync(): void {
      const thisSelectedTime = this.selectedTime
      const thisGetFormattedTime = this.getFormattedTime
      const reservationDate = this.availableTimes.find((time: Date) => thisGetFormattedTime(time) === thisSelectedTime)
      this.reservation.date = new Date(reservationDate)

      ReservationService.createReservationAsync(this.reservation)
        .then(() => {
          this.savedReservations.push(new Reservation(this.reservation.name, this.reservation.email, this.reservation.partySize, this.reservation.date))
          this.resetFormData()
        })
        .catch(error => alert(error))
    }
  },
  async mounted() {
    this.reservation = new Reservation(null, null, 1, null)
    this.savedReservations = await ReservationService.getReservationsAsync()
  }
}
</script>
