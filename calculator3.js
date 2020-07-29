var calc = {
    input: [],
    memory: [],
    operator: [],
    decimals: [],

    addInput(digit) {
        if (digit === ".") { // prevents more than 1 decimal being used. 
            calc.decimals.push(digit);
            if (calc.decimals.length > 1) {
                calc.decimals.pop()
                return view.displayInput();
            }
        };
        if (digit === "." && calc.input.length == 0) { // inserts a 0 in front of decimal if no other numbers entered.
            this.input.push("0");
        };
        this.input.push(digit);
        view.displayInput()
    },

    addToMemory(digits) {
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
        this.decimals = [];
        view.displayMemory(); // shows memory instead of input, which is now 0.
    },

    modifier(action) { 
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
        calc.decimals = [];
    },
    
    equal() {
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
        calc.modifier(0.01)
    }
    else if (event.key === "_") { //+/- operator
        calc.modifier(-1)
    }
    else if (event.keyCode === 27) { //clear
        calc.allClear();
        view.displayInput();
    }
    else if (event.keyCode === 13) { //enter/equal
        calc.equal()
    }
    else if (event.keyCode === 8) { //delete
        let x = calc.input;
        let last = x[x.length -1];
        if (last === ".")  {
            calc.decimals = [];
        }
        calc.input.splice(calc.input.length-1, 1)
        view.displayInput();
    }

});
