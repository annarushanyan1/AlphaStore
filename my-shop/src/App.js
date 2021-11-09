import Footer from './componnents/Footer';
import Home from './componnents/Home';
import Header from './componnents/Header';
import Login from './componnents/Login';
import Dashboard from './componnents/Dashboard';
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




export default class App extends Component {
  state={
    count: 0
  }
  setWord(){

  }
  render() {
    fetch(
      '/api/shopProducts' 
    )
    .then(
    res=>res.json()
    )
    .then(
      data =>{
      localStorage.setItem("shopProducts",JSON.stringify(data['products']))
    
      }
    )
    
    let get = localStorage.getItem("user")
    if(get == 1)
    {
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
          <Header count={this.state.count}/>
          <Switch>
            <Route exact path="/" render={(props) => <Home countCart={countCart} {...props} /> }/>
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/account" component={Dashboard} />
            <Route path="/contactUs" component={ContactUs} />
            <Route path="/aboutUs" component={AboutUs} />
            {/* <Route path="/" component={Dashbroad} /> */}
            
          </Switch>
          <Footer />

        </BrowserRouter>

      </div>
    );
  }
}

