import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =
  import.meta.env.GEMINI_API_KEY || "AIzaSyBNS94x_CABpSjYripVb5QISPOQhLZGboY";

if (!GEMINI_API_KEY) {
  console.warn("error api");
}

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

const analysisSchema = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "STRING",
      description:
        "Un resumen amigable y empático de los resultados médicos en lenguaje sencillo (español).",
    },
    patientName: {
      type: "STRING",
      description: "Nombre del paciente si aparece en el documento, o null.",
    },
    date: {
      type: "STRING",
      description: "Fecha del examen si aparece.",
    },
    overallHealthScore: {
      type: "INTEGER",
      description:
        "Una puntuación estimada de salud general del 0 al 100 basada únicamente en estos resultados.",
    },
    biomarkers: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: {
            type: "STRING",
            description: "Nombre del indicador (ej. Glucosa, Colesterol).",
          },
          value: { type: "STRING", description: "Valor numérico encontrado." },
          unit: {
            type: "STRING",
            description: "Unidad de medida (ej. mg/dL).",
          },
          status: {
            type: "STRING",
            enum: ["Normal", "Alto", "Bajo", "Crítico"],
            description: "Evaluación clínica del valor.",
          },
          explanation: {
            type: "STRING",
            description:
              "Breve explicación de qué significa este valor para la salud.",
          },
        },
        required: ["name", "value", "unit", "status", "explanation"],
      },
    },
    recommendations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          description: { type: "STRING" },
          type: { type: "STRING", enum: ["diet", "exercise", "lifestyle"] },
        },
        required: ["title", "description", "type"],
      },
    },
  },
  required: ["summary", "biomarkers", "recommendations", "overallHealthScore"],
};

export const analyzeMedicalImage = async (base64Image, mimeType) => {
  try {
    const model = "gemini-2.5-flash"; // ⚠️ Asegúrate de que este modelo exista y esté disponible

    // Limpia el string base64 si incluye el encabezado de datos
    const cleanBase64 = base64Image.replace(
      /^data:image\/(png|jpeg|jpg|webp);base64,/,
      ""
    );

    const response = await ai.getGenerativeModel({ model }).generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64,
              },
            },
            {
              text: "Eres un asistente médico experto y empático. Analiza esta imagen de un examen médico o reporte de laboratorio. Extrae los datos con precisión y genera una interpretación útil para el paciente. Si la imagen no es legible o no parece un documento médico, indica eso en el resumen.",
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const result = response.response.text();
    if (result) {
      return JSON.parse(result);
    } else {
      throw new Error("No se pudo generar el análisis.");
    }
  } catch (error) {
    console.error("Error analyzing medical image:", error);
    throw error;
  }
};
