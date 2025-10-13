import { toast } from "sonner";

export default async function copy(text: string) {
  try {
    await window.navigator.clipboard.writeText(text);
    toast.success("Copied!");
  } catch (error) {
    toast.error("Failed to copy!");
  }
}