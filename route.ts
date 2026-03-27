import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (!token_hash || type !== "recovery") {
    return NextResponse.redirect(
      new URL("/update-password?error=invalid_link", request.url)
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: "recovery",
  });

  if (error || !data.session) {
    return NextResponse.redirect(
      new URL("/update-password?error=invalid_or_expired", request.url)
    );
  }

  const response = NextResponse.redirect(
    new URL("/update-password", request.url)
  );

  response.cookies.set("sb-access-token", data.session.access_token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}