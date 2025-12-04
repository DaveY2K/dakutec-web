import { redirect } from "next/navigation";

// Pokud chceš jiný default, změň "cs" na "en" / "de".
const DEFAULT_LOCALE = "cs";

export default function RootIndex() {
  redirect(`/${DEFAULT_LOCALE}`);
}
