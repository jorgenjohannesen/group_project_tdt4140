import { useRouter } from "next/dist/client/router";
import Layout from "../components/Layout";
import "../styles/globals.css";
import capitalize from "../utils/capitalize";

function App({ Component, pageProps }) {
  const router = useRouter();
  const is404Page = router.pathname == "/404";

  const isHomePage = router.pathname == "/";

  const hasSubPage = router.pathname.split("/").length > 1;

  if (is404Page) {
    return <Component {...pageProps} />;
  }

  if (isHomePage) {
    return (
      <Layout title={"Home"}>
        <Component {...pageProps} />
      </Layout>
    );
  }

  if (hasSubPage) {
    const split = router.pathname.split("/");

    // A generic title, instead of trying to parse a dynamic slug
    const title = split[1];

    return (
      <Layout title={capitalize(title)}>
        <Component {...pageProps} />
      </Layout>
    );
  }

  return (
    <Layout title={capitalize(router.pathname.substring(1))}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
