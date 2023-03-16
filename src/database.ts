import "reflect-metadata"
import { DataSource as Database } from "typeorm"

export const db = new Database({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
})
