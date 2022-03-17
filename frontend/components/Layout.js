import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";
import Container from "@mui/material/Container";

const Layout = ({ title, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="HikeLink" />
        <link rel="icon" href="/img/logo.png" />
      </Head>

      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <header>
          <Navbar />
        </header>

        <main>
          <Container>{children}</Container>
        </main>

        <footer style={{flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default Layout;
