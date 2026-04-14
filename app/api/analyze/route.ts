import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // DIT MOET JE NU ZIEN IN JE TERMINAL (VS CODE / MAC TERMINAL)
  console.log("\n\n\n");
  console.log("############################################################");
  console.log("###                                                      ###");
  console.log("###             API REQUEST ONTVANGEN IN TERMINAL        ###");
  console.log("###                                                      ###");
  console.log("############################################################");

  try {
    const body = await request.json();
    const modelId = body.model;

    // Alleen de base64 data pakken
    const image = body.image.includes(",")
      ? body.image.split(",")[1]
      : body.image;

    console.log(`[TERMINAL LOG] Model gebruiken: ${modelId}`);
    console.log(
      `[TERMINAL LOG] Afbeelding grootte: ${body.image.length} tekens`,
    );

    const response = await fetch(
      `https://detect.roboflow.com/${modelId}?api_key=quezFRK7ia14RnaZexEX&confidence=0.1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: image,
      },
    );

    const result = await response.json();

    console.log("############################################################");
    console.log("###             ANTWOORD VAN ROBOFLOW ONTVANGEN          ###");
    console.log("############################################################");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n\n\n");

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    );
    console.error(
      "!!!             CRASH IN BACKEND ROUTE                   !!!",
    );
    console.error(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    );
    console.error(error);
    return NextResponse.json({ error: "Server crash" }, { status: 500 });
  }
}
