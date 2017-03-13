let PINS = [];
for (let j = 0; j<60; j++){
  let PIN = "";
  for (let i=0; i<4; i++){
    PIN += String(parseInt(Math.random()*10));
  }
  PINS[j] = PIN.slice(0);
  // console.log(PIN);
}


