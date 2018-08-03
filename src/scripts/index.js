import printMe from './print';
import '../styles/commons.scss';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');
  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;
  element.appendChild(btn);
  return element;
}

const element = component();
document.body.appendChild(element);
