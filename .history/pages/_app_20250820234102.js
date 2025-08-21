import "../styles/globals.css"; // ✅ debe seguir así
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
