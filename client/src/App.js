import React from "react";
import { BrowserRouter as Router,Route } from "react-router-dom";
import Footer1 from "./components/layout/Footer1";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

function App() {
  return (
    <Router>
      <Header />
      <div className="container container-fluid">
     
          <Route exact path="/" component={Home}/>
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} />
  
      </div>
      <Footer1 />
    </Router>
  );
}

export default App;
