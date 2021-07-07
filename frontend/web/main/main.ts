import { HomeView } from './home_view';

document.documentElement.style.fontSize = "10px";
document.body.style.margin = "0";
document.body.style.fontSize = "0";
document.body.appendChild(HomeView.create());
