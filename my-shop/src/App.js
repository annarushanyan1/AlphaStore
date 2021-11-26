import Footer from './componnents/Footer';
import Home from './componnents/Home';
import Header from './componnents/Header';
import Login from './componnents/Login';
import './styles/App.css';
import { Component } from 'react';
import Registration from './componnents/Registration';
import {
  BrowserRouter,
  Switch,
  Route

} from 'react-router-dom';
import ContactUs from './componnents/ContactUs';
import AboutUs from './componnents/AboutUs';
import OneItem from './componnents/OneItem';
import Menu from './componnents/Menu';
import ProductsFromCategories from './componnents/ProductsFromCategories';
import Dash from './componnents/Dash';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import Forbidden from './PrivateRoute/Forbidden';
import Buy from './componnents/Buy';




export default class App extends Component {
  state = {
    count: 0
  }
  setWord() {
  }
  componentDidMount() {
    fetch(
      '/api/shopProducts'
    )
      .then(
        res => res.json()
      )
      .then(
        data => {
          let product = data['products'];
          localStorage.setItem("shopProducts", JSON.stringify(product));
        }
      )

  }
  menuShown() {
    let loc = window.location.pathname;
    if (loc === '/login') {
      return null
    }
    return <Menu />
  }
  isAuthenticated() {
    let status = localStorage.getItem("user");
    if (Number(status) === 0) {
      return true
    }
    return false
  }

  render() {
   
    if(!localStorage.getItem("shopProducts")){
      localStorage.setItem("shopProducts","[]")
      localStorage.setItem("user",1)
      setTimeout(
        ()=>{
              window.location.reload()
        }
      )
    }



    let get = localStorage.getItem("user")

    if (Number(get) === 1) {
      localStorage.removeItem("products")
      localStorage.removeItem("firstname")
      localStorage.removeItem("lastname")
      localStorage.removeItem("count")
      localStorage.removeItem("userId")
    }
    const countCart = (val) => {
      this.setState({
        count: val
      })
    }
    return (
      <div className="App">
        <BrowserRouter>
          <Header count={this.state.count} />
          <Switch>
            <Route exact path="/" render={(props) => <Home countCart={countCart} {...props} />} />
           
            <PrivateRoute
              path="/login"
              isAuthenticated={!this.isAuthenticated()}
            >
             <Login/>
            </PrivateRoute>

            <Route path="/login" component={Login} />
            {/* <Route path="/account" component={Dash} /> */}
            {/* <Route path="/registration" component={Registration} /> */}
            <PrivateRoute
              path="/registration"
              isAuthenticated={!this.isAuthenticated()}
            >
             <Registration/>
            </PrivateRoute>

            <PrivateRoute
              path="/account"
              isAuthenticated={this.isAuthenticated()}
            >
              <Dash />
            </PrivateRoute>
            <Route path="/contactUs" component={ContactUs} />
            <Route path="/aboutUs" component={AboutUs} />
            <Route path="/buy" component={Buy} />
            <Route path="/categories/:name" render={(props) => <ProductsFromCategories  {...props} />} />
            <Route path="/product/:id" render={(props) => <OneItem  {...props} />} />
            <Route path="/forbidden" component={Forbidden} />

          </Switch>
          <Footer />

        </BrowserRouter>

      </div>
    );
  }
}

