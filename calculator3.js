var calc = {
    input: [],
    memory: [],
    operator: [],

    addInput(digit) {
        //debugger;
        if (digit === "." && calc.input.includes(".")) { // prevents more than 1 decimal from being used
            return view.displayInput();
        }; 
        if (digit === "." && calc.input.length == 0) { // inserts a 0 in front of decimal if no other numbers entered.
            this.input.push("0");
        };
        this.input.push(digit);
        view.displayInput()
    },

    addToMemory(digits) {
        //debugger;
        if (this.memory.length > 0 && this.operator.length > 0) { // fixes continuous operator commands
            if ((event.target.className === "operator" || event.key === "-" || event.key === "+" || event.key === "/" || event.key === "*") && this.input.length == 0) {
                return calc.operator.shift();
            }
            return this.equal(); //
        };

        if (this.memory.length > 0 && this.input.length > 0) { //if numbers are input after pressing equal, calc is reset.
            this.memory = [];
        };

        for (var i = 0; i < calc.input.length; i++) {  // necessary for continued calc after equal()
            this.memory.push(digits[i]);
        }
        this.convert(calc.memory);
        this.input = [];
        view.displayMemory(); // shows memory instead of input, which is now 0.
    },

    modifier(action) { 
        //debugger;
        if (this.input == 0) {
            this.convert(this.memory)
            this.memory[0] = this.memory[0] * action;
            view.displayMemory();
        } else {
            this.convert(this.input);
            this.input[0] = this.input[0] * action; 
            view.displayInput();
        }       
    },

    convert(location) { // converts array of numbers into 1 number
        let x = location;
        x = +x.join('');
        location.length = 0;
        location.push(x);
    },

    allClear() {
        calc.input = [];
        calc.memory = [];
        calc.operator = [];
    },
    
    equal() {
        //debugger;
        this.convert(calc.input);
        if (calc.operator == "*") {
            var answer = calc.memory * calc.input;
        } 
        else if (calc.operator == "/") {
            var answer = calc.memory / calc.input;   
        }
        else if (calc.operator == "-") {
            var answer = calc.memory - calc.input;  
        }
        else if (calc.operator == "+") {
            var answer = Number(calc.memory) + Number(calc.input);
        } 
        else if (calc.operator == 0) { // returns input contents if no operator pressed.
            if (calc.input == 0) { //if after calculation
                calc.input = [];
                return view.displayMemory();
            } else { //if after only input
            return view.displayInput();
            }
        }

        this.allClear(); 
        this.memory.push(answer); // allows back-to-back calculations
        view.displayMemory();
        console.log(answer);
    }
};

var view = {
    displayInput() {
        //debugger;
        let x = calc.input;
        let last = x[x.length -1];
        if (last === "." || last === 0 || last === '') {
            x = x.join('');
            document.querySelector('h1').innerHTML = x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            console.log(x);
        } else {
            x = x.join('');
            document.querySelector('h1').innerHTML = Number(x).toLocaleString(undefined, {maximumFractionDigits: 8});
            console.log(x);
        }
    },

    displayMemory() {
        let x = calc.memory;
        x = x.join('');
        document.querySelector('h1').innerHTML = Number(x).toLocaleString(undefined, {maximumFractionDigits: 8});
    },
};

var handlers = {
    buttons() {
        //console.log(event)
        //debugger;
        if (event.target.className === "number") {
            calc.addInput(parseInt(event.target.textContent));
        }
        else if (event.target.className === "decimal") {
            calc.addInput(event.target.textContent);
        }
        else if (event.target.className === "operator") {
            calc.addToMemory(calc.input);
            calc.operator.push(event.target.id);
            console.log(event.target.id); 
        }
        else if (event.target.className === "modifier") {
            console.log(event.target.textContent);
            calc.modifier(Number(event.target.id));
        }
        else if (event.target.className === "clear") {
            calc.allClear();
            view.displayInput(); // moved from allClear()
        }
        else if (event.target.className === "equal") {
            calc.equal();
        }
    }
};

document.addEventListener("keydown", function(event) {
    //console.log(event);
    //debugger;
    if (event.key >= 0 && event.key <= 9) { // 0-9
        calc.addInput(parseInt(event.key));
    }
    else if (event.key === ".") { //decimal
        calc.addInput(event.key);
    }
    else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") { //operators
        calc.addToMemory(calc.input);
        calc.operator.push(event.key);
        console.log(event.key); 
    }
    else if (event.key === "%") { //% modifier
        calc.modifier(event.key, event.srcElement.children[0].children[0].childNodes[7].id)
    }
    else if (event.altKey === true && event.keyCode === 189) { //+/- operator
        calc.modifier(event.key, -1)
    }
    else if (event.keyCode === 27) { //clear
        calc.allClear();
        view.displayInput(); // moved from allClear() 
    }
    else if (event.keyCode === 13) { //enter/equal
        calc.equal()
    }
    else if (event.keyCode === 8) { //delete
        //debugger;
        let x = calc.input;
        let last = x[x.length -1];
        if (last === ".")  {
            calc.decimals = [];
        }
        calc.input.splice(calc.input.length-1, 1)
        view.displayInput();
    }

});




/*
 

glitches: 
//FIXED 1) when you do a calculation and hit equal, then type in more numbers then hit an operator, in concats the memory and the input. [added an if condition in addToMemory() for if input and memory have contents, it will reset memory and basically proceed with a blank slate. Middle "if" condition.]

//FIXED 2) Sometimes hitting % on a decimal number returns a very long number. [x.toLocaleString() fixes this, and you can set the number of decimal places here also]

//FIXED 3) Decimals do not appear when you press the decimal button, only after you press another number. also, zeros do not appear after pressing the decimal either until you press another number. [a RE is in charge if the last input was a . or 0, then toLocaleSring() handles all 1-9 inputs]

//FIXED 4) How to insert commas for large numbers? [use x.toLocaleString(maximumFractionDigits) and a RE]

5) find a way to limit the size of very big numbers to the window? Try getting it to switch to a smaller font.

//FIXED 6) when pressing % and +/- after the operator but before your next input, the screen sets to 0 and does not process the button, but will go through with the equation. [easy fix = remove "&& calc.operator == 0" from your if operators in modifiers() and it will process % and +/- in any condition.]

//FIXED 7) AC now leaves a blank screen, not a 0, due to the Expression in view.displayInput(); [not if you let toLocaleString() handle numbers, and RE handles . & 0's.]

//FIXED 8) allows you to type in more than one '.' [added if condition to calc.addDigits() and a condition to view.displayInput to allow blank strings to be treated with RE]

// FIXED 9) commas are inserted on decimals larger than a 1,000th when a 0 is input. [use this RE: /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","]

//FIXED 10) NaN is returned when you type in a number and hit equal. Way to return just that number when hitting equal? [added another if else condition on the end of equal for if operator is empty, just return input value]

// FIXED 11) hook up keyboard.

//FIXED 12) Returns 0 when you hit 2 operators in a row. Make it so that it just changes to most recently pressed. [added a conditional  checking if the operators and input were greater than 0. if so, delete the last operator entered]





    decimals: [],

    addInput(digit) {
        if (digit == ".")
            this.decimals.push(digit)
            let x = calc.input;
            let last = x.length -1;
            if (decimals.length > 1) {
            this.input.splice(last, 1)
        }
        
        else {
            this.input.push(digit);
            view.displayInput()
        }
    },


view.displayInput() workshop:

       displayInput: function() {
        //debugger;
        let x = calc.input;
        let last = x[x.length -1];
        if (last === "." || last === 0 || last === '') {
            x = x.join('');
            document.querySelector('h1').innerHTML = x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            console.log(x);
        } 
        else {
            x = x.join('');
            document.querySelector('h1').innerHTML = Number(x).toLocaleString(undefined, {maximumFractionDigits: 8});
            console.log(x);
        }
    },


        RE alternate: /\d{1,3}(?=(\d{3})+(?=\.))/g



calc.modifier() workshop:

refactoring idea: why not just call displayInput at the end of this? This works as far as i can tell, so i inserted it into the % modifier but left the old code intact for +/-.

if (event.target.textContent == "%") {
    if (calc.input == 0 && calc.operator == 0) {
        let x = calc.memory;
        calc.memory = [];
        calc.memory.push(x / 100)
        view.displayMemory();
    }
    else {
        let x = calc.input;
        x = +x.join('');
        calc.input = [];
        calc.input.push(x / 100);            
        view.displayInput();
    }

old modifier before argument streamlining

    modifier(char) { 
        //if (char == "%") {
            console.log(char)
            if (calc.input == 0) {
                let x = calc.memory;
                calc.memory = [];
                calc.memory.push(x * 0.01)
                view.displayMemory();
            }
            else {
                let x = calc.input;
                x = +x.join('');
                calc.input = [];
                calc.input.push(x * 0.01);            
                view.displayInput();
            }
        } else {
            console.log(char)
            if (calc.input == 0) {
                let x = calc.memory;
                calc.memory = [];
                calc.memory.push(x * -1)
                view.displayMemory();
            }
            else {
                let x = calc.input;
                x = +x.join('');
                calc.input = [];
                calc.input.push(x * -1);            
                view.displayInput();
            }
        }       
    },

    initial keyboard connections

    // else if ((event.shiftKey === true && event.keyCode === 187) || (event.shiftKey === true && event.keyCode === 56) || event.keyCode === 189 || event.keyCode === 191) {
    //     calc.addToMemory(calc.input)
    //     calc.operator.push(event.key);
    //     console.log(event.key);
    // }
    // else if (event.keyCode === 88) {
    //     calc.addToMemory(calc.input)
    //     calc.operator.push('*');
    //     console.log('*');
    // }
    // if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 190){
    //     calc.addInput(event.key)
    // } 







    */