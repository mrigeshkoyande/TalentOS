import { GoogleGenerativeAI } from '@google/generative-ai'
import type { InferredProfile } from '../types'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const SYSTEM_PROMPT = `You are TalentOS Neural Analysis Engine. Given a raw job description, extract and return a structured JSON profile.
Return ONLY valid JSON in this exact schema:
{
  "archetypeMatrix": [
    { "label": "string", "matchPercent": number (0-100), "description": "string" }
  ],
  "trajectoryDynamics": [
    { "timeframe": "string", "outcome": "string", "riskVector": "string" }
  ]
}
archetypeMatrix should have 2-4 items representing core capability archetypes.
trajectoryDynamics should have 2-3 items representing expected trajectory milestones.
Be precise, enterprise-grade, and avoid marketing language.`

export async function analyzeJD(rawText: string): Promise<InferredProfile> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const prompt = `${SYSTEM_PROMPT}\n\nJob Description:\n${rawText}`
  
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  
  // Strip markdown code fences if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
  const cleaned = (jsonMatch[1] || text).trim()
  
  return JSON.parse(cleaned) as InferredProfile
}
