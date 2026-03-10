import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }, { status: 500 })
    }
    const body = await req.json()
    const { departure, destination, duration, boatType, experience } = body

    if (!departure || !destination) {
      return NextResponse.json({ error: 'Departure and destination are required' }, { status: 400 })
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

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Clean and parse JSON
    const cleaned = content.text.replace(/```json|```/g, '').trim()
    const tripPlan = JSON.parse(cleaned)

    return NextResponse.json({ tripPlan })
  } catch (error: unknown) {
    console.error('Trip planning error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to plan trip: ${message}` }, { status: 500 })
  }
}
