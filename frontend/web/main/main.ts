import { HomePage } from './home_page';

document.documentElement.style.fontSize = "10px";
document.body.style.margin = "0";
document.body.style.fontSize = "0";
document.body.appendChild(HomePage.create());
