// import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// tanish , tanish67@gmail.com, TSS181103, 18 

function App() {

  // const [apiRes, setApiRes] = useState("No Response");
  const [registerData, setRegisterData] = useState({
    password: '', email: '', age: '', gender: 'Male', name: ''
  })

  const [loginData, setLoginData] = useState({
    password: '', email: ''
  })

  const [userData, setUserData] = useState(null)

  // const checkApi = () => {
  //   fetch('http://localhost:8000', {
  //     method: 'GET',
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {

  //       console.log(data.message);

  //       setApiRes(data.message)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setApiRes("Error fetching data");
  //     });
  // };

  // useEffect(() => {
  //   checkApi();
  // }, []);


  const handleRegister = () => {
    fetch('http://localhost:8000/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    })
      .then((res) => {
        return res.json()
      })  // Returning the result of res.json()
      .then((data) => {
        console.log("response Data:", data);
      })
      .catch((err) => {
        console.log("Erros: ", err);
      });

  };

  const handleLogin = () => {
    fetch('http://localhost:8000/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Response Data:", data); // Log the parsed response data
        console.log(data.accessToken)
        localStorage.setItem('accessToken', data.accessToken)
      })
      .catch((err) => {
        console.log("Error:", err); // Log errors, if any
      });
  };

  const getSavedToken = () => {
    const token = localStorage.getItem('accessToken')
    console.log(token)
  }

  const getUserData = () => {
    const accessToken = localStorage.getItem('accessToken')

    fetch('http://localhost:8000/getmyprofile', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        return res.json()
      })
      .then(
        (data) => {
          setUserData(data.user)
        }
      )


  }

  return (
    <div className="App">
      {/* <header className="App-header">
        <p>
          {apiRes}
        </p>
      </header> */}

      {/* Register  */}
      <h1>Register Form</h1>
      <form action="">
        <input type="text" placeholder='Name' onChange={(e) => { setRegisterData({ ...registerData, name: e.target.value }) }} /><br />
        <input type="email" placeholder='email' onChange={(e) => { setRegisterData({ ...registerData, email: e.target.value }) }} /><br />
        <input type="password" placeholder='Password' onChange={(e) => { setRegisterData({ ...registerData, password: e.target.value }) }} /><br />
        <input type='Number' placeholder='Age' onChange={(e) => { setRegisterData({ ...registerData, age: e.target.value }) }} /><br />
        <select
          value={registerData.gender}
          onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </form>
      <br />
      <input type="submit" value="REGISTER" onClick={handleRegister} />


      <h1>Login Form</h1>
      <form action="">
        <input type="email" placeholder='email' onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }} /><br />
        <input type="password" placeholder='Password' onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }} />
        <br />
        <input type="submit" value="LOGIN" onClick={handleLogin} />
      </form>

      <br />
      <button onClick={getSavedToken}>Get saved access token</button>

      <br /><br />

      <button onClick={getUserData}>Get User Data</button>
      <h1>UserData</h1>
      {
        userData && <div>
          <p> {userData.name} </p>
          <p> {userData.email} </p>
          <p> {userData.age} </p>
          <p> {userData.gender} </p>
        </div>
      }

    </div>
  );
}

export default App;
