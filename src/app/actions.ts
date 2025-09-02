"use server"
import { Client } from "@upstash/qstash"

const qstashClient = new Client({
  // Add your token to a .env file
  token: process.env.QSTASH_TOKEN!,
})

export async function startBackgroundJob() {
  await qstashClient.publishJSON({
    url: "https://firstqstashmessage.requestcatcher.com/test",
    body: {
      hello: "world",
    },
  })
}
