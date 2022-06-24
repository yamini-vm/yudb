class Stack {
    constructor(stack_id, stack_size = 10) {
        this.stack_elem = document.getElementById(stack_id);
        this.stack_size = stack_size;

        this.stack = [];
        this.#renderStack();
    };

    #insertRow = (tbl, textData) => {
        const tr = tbl.insertRow();
        const td = tr.insertCell();
        const text = document.createTextNode(textData);

        td.appendChild(text);
        td.style.border = '2px solid black';
        td.style.borderCollapse = 'collapse';
        td.style.height = '20px';
        td.style.padding = '5px 10px';

        tbl.appendChild(tr);
    };

    #renderStack = () => {
        this.stack_elem.innerHTML = "";

        let tbl = document.createElement('table');
        tbl.style.width = '100px';
        tbl.style.border = '1px solid black';
        tbl.style.borderCollapse = 'collapse';
        tbl.style.textAlign = 'center';

        for (let i = 0; i < this.stack_size - this.stack.length; i++) {
            this.#insertRow(tbl, '');
        }

        for (let i = this.stack.length - 1; i >= 0; i--) {
            this.#insertRow(tbl, this.stack[i]);
        }

        this.stack_elem.appendChild(tbl);
    };

    push = (value) => {
        if (value.length > 0) {
            if (this.stack.length < this.stack_size) {
                this.stack.push(value);
                this.#renderStack();
            } else {
                alert("Stack is full!");
            }
        } else {
            alert('Please enter a value!');
        }
    };

    pop = () => {
        if (this.stack.length > 0) {
            this.stack.pop();
            this.#renderStack();
        } else {
            alert('The stack is empty!');
        }
    };
}