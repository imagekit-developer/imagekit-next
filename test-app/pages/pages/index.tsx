import { Basic } from "../../components/basic";
import { ImageEvents } from "../../components/ImageClient";

export default function Home() {
  return (
    <div className="container">
      <Basic />
      <h1>Advanced</h1>
      <ImageEvents />
    </div>
  );
}
