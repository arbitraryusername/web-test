import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  AllowNull,
  NotEmpty
} from 'sequelize-typescript'

@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @AllowNull(false)
  @NotEmpty
  @Column
  name: string

  @AllowNull(false)
  @NotEmpty
  @Column
  email: string

  @AllowNull(false)
  @Column
  partySize: number

  @AllowNull(false)
  @Column
  date: Date

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
