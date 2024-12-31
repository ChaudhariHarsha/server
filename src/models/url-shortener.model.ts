import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, Index, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'url_shortener',
  schema: 'core', // Use the schema 'core'
  timestamps: true, // Automatically map createdAt and updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UrlShortener extends Model<UrlShortener> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'url_id',
  })
  urlId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'original_url',
  })
  @Index // Adds an index on this column
  originalUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
    field: 'shorten_url',
  })
  @Index // Adds an index on this column
  shortenUrl: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    field: 'count',
  })
  count: number;

  @Column({
    type: DataType.INTEGER,
    field: 'created_by',
  })
  createdBy: number;

  @Column({
    type: DataType.INTEGER,
    field: 'updated_by',
  })
  updatedBy: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt: Date;
}
