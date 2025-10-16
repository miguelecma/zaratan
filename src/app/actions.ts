"use server";
import { Client } from "@upstash/qstash";

const qstashClient = new Client({
  // Add your token to a .env file
  token: process.env.QSTASH_TOKEN!,
});

export async function startBackgroundJob(name: string) {
  try {
    const response = await qstashClient.publishJSON({
      url: "https://zaratan.vercel.app/api/register",
      body: {
        user: name,
        order: [{ name: "INQUISICIÓN", quantity: 1 }],
      },
    });
    return response.messageId
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getLogs() {
  try {
    const response = await fetch("https://qstash.upstash.io/v2/logs", {
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
      },
    });
    return response.json().then((data) => data.events);
  } catch (error) {
    console.error(error);
    return null;
  }
}
