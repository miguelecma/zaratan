"use server";
import { Client } from "@upstash/qstash";

const qstashClient = new Client({
  // Add your token to a .env file
  token: process.env.QSTASH_TOKEN!,
});

export async function startBackgroundJob() {
  try {
    const response = await qstashClient.publishJSON({
      url: "https://zaratan.vercel.app/api/register",
      body: {
        user: "zaratan",
        order: [{ name: "INQUISICIÓN", quantity: 1 }],
      },
    });
    return response.messageId
  } catch (error) {
    console.error(error);
    return null;
  }
  
}
