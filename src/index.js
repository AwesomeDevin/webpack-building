// window.onload=function(){
// 	const greeter = require('./greeter.js');
// 	
// 	document.getElementById("root").appendChild(greeter());
// }

import React from 'react';
import {render} from 'react-dom';
import Greeter from './greeter';

console.log(document.getElementById('root'));
console.info(document.getElementById('root'));
console.error(document.getElementById('root'));
console.warn(document.getElementById('root'));

render(<Greeter />, document.getElementById('root'));


