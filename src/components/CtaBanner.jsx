import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { Typewriter } from "react-simple-typewriter";

export default function CtaBanner() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchCta = async () => {
      const { data, error } = await supabase
        .from("call_to_action")
        .select("description")
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching CTA:", error);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data.map((item) => item.description));
      }
    };

    fetchCta();
  }, []);

  if (messages.length === 0) return null;

  return (
    <div
      className="text-white p-6 rounded mb-6 font-alata"
      style={{ backgroundColor: "#C0307F" }}
    >
  <p className="text-xl font-bold ">
  <Typewriter
    words={messages}
    loop={true}
    cursor
    cursorStyle="|"
    typeSpeed={50}
    deleteSpeed={30}
    delaySpeed={1500}
    />
  </p>
    </div>
  );
}
