import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured.' }), { status: 500 })
  }

  const body = await req.json()
  const { departure, destination, duration, boatType, experience } = body

  if (!departure || !destination) {
    return new Response(JSON.stringify({ error: 'Departure and destination are required' }), { status: 400 })
  }

  const prompt = `You are Skipper, an expert nautical trip planner with deep knowledge of sailing routes, maritime weather, and seamanship.

Plan a boat trip with these details:
- Departure: ${departure}
- Destination: ${destination}
- Duration: ${duration || 'flexible'}
- Boat type: ${boatType || 'sailboat'}
- Skipper experience level: ${experience || 'intermediate'}

Provide a trip plan in this EXACT JSON format (no markdown, no extra text, just valid JSON — keep all string values concise, under 20 words each):
{
  "tripName": "Creative name for this voyage",
  "summary": "2-3 sentence overview of the trip",
  "distance": "Approximate nautical miles",
  "bestSeason": "Best time of year to make this trip",
  "estimatedDays": "Recommended trip duration",
  "route": {
    "overview": "High-level route description",
    "waypoints": [
      { "name": "Waypoint name", "description": "Brief description and what to do/watch for" }
    ]
  },
  "weather": {
    "typicalConditions": "What weather to expect",
    "windPatterns": "Prevailing winds and patterns",
    "hazards": "Weather hazards to watch for",
    "tip": "Pro weather tip for this route"
  },
  "checklist": {
    "safety": ["item1", "item2", "item3", "item4", "item5"],
    "navigation": ["item1", "item2", "item3", "item4"],
    "provisions": ["item1", "item2", "item3", "item4", "item5"],
    "documents": ["item1", "item2", "item3"]
  },
  "costs": {
    "fuel": "Estimated fuel cost range",
    "marina": "Marina/anchorage fees estimate",
    "provisions": "Food and provisions estimate",
    "total": "Total estimated cost range",
    "currency": "USD"
  },
  "tips": [
    { "title": "Pro tip title", "body": "Detailed advice" },
    { "title": "Pro tip title", "body": "Detailed advice" },
    { "title": "Pro tip title", "body": "Detailed advice" }
  ],
  "affiliateContext": {
    "boatRentalNeeded": true,
    "insuranceRecommended": true,
    "gearSuggestions": ["item1", "item2", "item3"]
  }
}`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullText = ''

        const anthropicStream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullText += chunk.delta.text
            // Send a heartbeat so the client knows we're still working
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'generating' })}\n\n`))
          }
        }

        const cleaned = fullText.replace(/```json|```/g, '').trim()
        const tripPlan = JSON.parse(cleaned)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ tripPlan })}\n\n`))
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `Failed to plan trip: ${msg}` })}\n\n`))
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
