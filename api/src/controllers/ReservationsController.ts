import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Reservation } from '../models/Reservation'
import { Reservation as ReservationDto } from '../dataTransferObjects/Reservations'

@Controller('restaurant')
export class ReservationsController {
  @Get('reservations')
  private async getReservationsAsync(req: Request, res: Response) {
    try {
      const reservations = await Reservation.findAll()

      const reservationDtos: ReservationDto[] = []
      if (Array.isArray(reservations)) {
        reservations.forEach((reservation: Reservation) => {
          const reservationDto = new ReservationDto(reservation.name, reservation.email, reservation.partySize, reservation.date)
          reservationDtos.push(reservationDto)
        })
      }
  
      return res.status(200).json(reservationDtos)
    }
    catch (error) {
      return res.status(400).json(error)
    }
  }

  @Post('reservations')
  private async createReservationAsync(req: Request, res: Response) {
    const reservationDto: ReservationDto = req.body;

    try {
      await Reservation.create(reservationDto)
      return res.status(200).json('success')
    }
    catch (error) {
      return res.status(400).json(error)
    }
  }
}
