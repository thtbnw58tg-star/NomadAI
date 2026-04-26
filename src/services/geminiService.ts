import { GoogleGenAI } from "@google/genai";
import { TravelPreferences, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `Eres NomadAI, un experto asistente de viajes de lujo y aventura con acceso a información en tiempo real. 
Tu objetivo es crear itinerarios detallados, emocionantes y prácticos.
Cada itinerario DEBE incluir:
1. Una visión general del viaje.
2. Desglose día a día con horarios sugeridos.
3. Recomendaciones específicas de ESTANCIAS (Hoteles/Airbnbs), VISITAS y RESTAURANTES.
4. CADA RECOMENDACIÓN DEBE LLEVAR:
   - Nombre y breve descripción.
   - PRECIO ESTIMADO al lado (ej: [Nombre] - 50€/noche).
   - ENLACE DE RESERVA o Google Maps directo (ej: [Reservar aquí](https://...)).
5. ESTIMACIONES DE PRECIOS REALES: Vuelos y alojamientos actuales.
6. PRESUPUESTO DETALLADO: Muestra el presupuesto Total y el presupuesto Promedio por Día.
7. SUGERENCIAS DE EQUIPAJE: Basadas en la climatología prevista.
8. FAMILIAS: Si viajan con niños, incluye actividades adecuadas para sus edades y consejos familiares.
9. VIAJAR CON MASCOTAS: Si aplica, consejos y lugares pet-friendly.

Usa Markdown para el formato. Sé inspirador pero realista. Utiliza el buscador para dar datos verídicos y actuales.`;

export async function generateItinerary(prefs: TravelPreferences): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${SYSTEM_PROMPT}\n\nCrea un itinerario de viaje de ${prefs.origin} a ${prefs.destination}.
Detalles:
- Fechas: ${prefs.startDate} al ${prefs.endDate}
- Presupuesto: ${prefs.budget}
- Intereses: ${prefs.interests.join(", ")}
- Adultos: ${prefs.numTravelers}
- Niños: ${prefs.numChildren} ${prefs.numChildren > 0 ? `(Edades: ${prefs.childrenAges})` : ''}
- Mascotas: ${prefs.hasPets ? 'SÍ' : 'NO'}
- Estilo: ${prefs.travelers}
- Idioma: ${prefs.language === 'es' ? 'Español' : 'English'}.

IMPORTANTE: Busca el clima actual para esas fechas, precios de los vuelos desde ${prefs.origin} y hoteles en ${prefs.destination}. Muestra el precio al lado de cada recomendación y añade enlaces de reserva directos.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return response.text || "No pudimos generar el itinerario.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("No pudimos conectar con el guía experto en este momento.");
  }
}

export async function chatWithItinerary(history: ChatMessage[], nextMessage: string, language: string): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `${SYSTEM_PROMPT}\n\nIdioma: ${language === 'es' ? 'Español' : 'English'}`,
        tools: [{ googleSearch: {} }]
      },
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      }))
    });

    const result = await chat.sendMessage({ 
      message: nextMessage
    });
    return result.text || "Lo siento, no pude procesar esa solicitud.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Error al procesar tu solicitud de chat.");
  }
}
