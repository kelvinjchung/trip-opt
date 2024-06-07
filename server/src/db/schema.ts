import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `tripopt_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 128 }).primaryKey(),
  name: varchar("name", { length: 32 }).notNull(),
});

export const plans = createTable("plan", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("userId", { length: 128 }),
  name: varchar("name", { length: 128 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  destination_placeId: varchar("destination_placeId", {
    length: 256,
  }).notNull(),
  destination_name: varchar("destination_name", { length: 56 }).notNull(),
  destination_lat: decimal("destination_lat", {
    precision: 9,
    scale: 6,
  }).notNull(),
});

export const locations = createTable("location", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  placeId: varchar("place_id", { length: 256 }).notNull(),
  lat: decimal("lat", { precision: 9, scale: 6 }).notNull(),
  lng: decimal("lat", { precision: 9, scale: 6 }).notNull(),
  address: varchar("address", { length: 128 }).notNull(),
  types: varchar("types", { length: 30 })
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),
  dateTime: timestamp("dateTime"),
  locked: boolean("locked").notNull().default(false),
  planId: uuid("planId")
    .references(() => plans.id)
    .notNull(),
});
