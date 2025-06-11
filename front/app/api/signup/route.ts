import { NextRequest, NextResponse } from "next/server";
import { apiUrl } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const BACKEND_URL = apiUrl + "/auth/signup";

    const backendResponse = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseText = await backendResponse.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      console.error("❌ Response was:", responseText);

      return NextResponse.json(
        {
          success: false,
          message: "El servidor backend devolvió una respuesta inválida",
          debug: {
            status: backendResponse.status,
            responsePreview: responseText.substring(0, 200),
          },
        },
        { status: 500 }
      );
    }
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("❌ MAJOR ERROR in signup route:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error conectando con el servidor",
      },
      { status: 500 }
    );
  }
}
