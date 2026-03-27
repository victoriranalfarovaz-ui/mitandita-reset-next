"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export default function UpdatePasswordPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info">(
    "info"
  );

  useEffect(() => {
    const init = async () => {
      const access_token = getCookie("sb-access-token");
      const refresh_token = getCookie("sb-refresh-token");

      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");

      if (error) {
        setMessage("El enlace no es válido o ya expiró. Solicita uno nuevo.");
        setMessageType("error");
        setReady(false);
        return;
      }

      if (!access_token || !refresh_token) {
        setMessage("No se encontró una sesión válida. Solicita un enlace nuevo.");
        setMessageType("error");
        setReady(false);
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) {
        setMessage("No se pudo validar la sesión.");
        setMessageType("error");
        setReady(false);
        return;
      }

      setMessage("Escribe tu nueva contraseña.");
      setMessageType("info");
      setReady(true);
    };

    init();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Completa ambos campos.");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Mínimo 6 caracteres.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message || "Error al actualizar.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    deleteCookie("sb-access-token");
    deleteCookie("sb-refresh-token");

    await supabase.auth.signOut();

    setMessage("Contraseña actualizada correctamente.");
    setMessageType("success");
    setReady(false);
    setLoading(false);
  };

  const openApp = () => {
    window.location.href = "mitandita://login";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#FF7A00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 20,
          padding: 28,
        }}
      >
        <img
          src="/logo.png"
          alt="MiTandita"
          style={{
            width: 150,
            margin: "0 auto 10px",
            display: "block",
          }}
        />

        <h2 style={{ textAlign: "center" }}>Cambiar contraseña</h2>

        {message && (
          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 10,
              background: messageType === "error" ? "#fee2e2" : "#ecfdf5",
            }}
          >
            {message}
          </div>
        )}

        {ready && (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 12, marginTop: 12 }}
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: 12, marginTop: 12 }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: 12,
                marginTop: 12,
                background: "#FF7A00",
                color: "white",
                border: "none",
              }}
            >
              Guardar contraseña
            </button>
          </form>
        )}

        <button
          onClick={openApp}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 12,
            background: "#000",
            color: "white",
            border: "none",
          }}
        >
          Volver a la app
        </button>
      </div>
    </main>
  );
}