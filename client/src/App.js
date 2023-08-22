import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './login';
import Dashboard from './dashboard';
import './App.css';

const code = new URLSearchParams(window.location.search).get("code");

export default function Home() {
  // Shows dashboard if access code exists, otherwise shows login page
  return code ? <Dashboard code={code} /> : <>
    <body>
      <header>
        <h1 className="text-2xl"><center>Sound Sage AI</center></h1>
        <h2><center>An AI-powered Spotify artist recommender</center></h2>
        <center><Login /></center>
      </header>
    </body>
  </>
}