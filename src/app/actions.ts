"use server"
import { Client } from "@upstash/qstash"

const qstashClient = new Client({
  // Add your token to a .env file
  token: process.env.QSTASH_TOKEN!,
})

export async function startBackgroundJob() {
  await qstashClient.publishJSON({
    url: "https://zaratan.vercel.app/api/register",
    body: {
      user: "zaratan",
      order: [{name: "INQUISICIÓN", quantity: 1}]
    },
  })
}
