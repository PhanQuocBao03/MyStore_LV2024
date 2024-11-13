

import Headers from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Routers from "../routes/Routers";

const Layout = () =>{
    return( 
    <>
        <Headers />
        <main id="main">
            <Routers/>
        </main>
        <Footer/>
    </>)
}

export default Layout;