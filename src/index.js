// window.onload=function(){
// 	const greeter = require('./greeter.js');
// 	console.log(document.getElementById("root"))
// 	document.getElementById("root").appendChild(greeter());
// }

import React from 'react';
import {render} from 'react-dom';
import Greeter from './greeter';

console.log(document.getElementById('root'))
render(<Greeter />, document.getElementById('root'));

