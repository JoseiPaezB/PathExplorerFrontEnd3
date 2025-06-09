import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { apiUrl } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const backendResponse = await axios.post(
      `${apiUrl}/auth/signup`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(backendResponse.data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("❌ Error in signup route:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || "Error connecting to backend server";
      const errorData = error.response?.data || {
        success: false,
        message: errorMessage,
      };

      console.error("❌ Backend error:", {
        status,
        message: errorMessage,
        data: error.response?.data,
      });

      return NextResponse.json(errorData, { status });
    }

    // Handle non-axios errors
    console.error("❌ Non-axios error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
