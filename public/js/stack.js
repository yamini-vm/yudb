class Stack {
    constructor(stack_id, stack_size = 10, entry_width = 40) {
        this.stack_elem = document.getElementById(stack_id);
        this.stack_size = stack_size;

        this.stack_css = `
            width: 150px;
            height: ${this.stack_size * entry_width + 20}px;
            border-width: 0px 2px 2px 2px;
            border-color: black;
            border-style: solid;
        `;
        this.stack_entry_css = `
            width: 150px;
            height: ${entry_width}px;
            border-width: 2px 0px 0px 0px;
            border-style: solid;
            border-color: black;
            text-align: center;
            line-height: ${entry_width}px;
        `;

        this.stack_elem.style.cssText = this.stack_css;

        this.stack = [];
        this.#render_stack();
    }

    #render_stack = () => {
        let stack_html = '';
        let count = 0;
        for (let i = 0; i < this.stack_size - this.stack.length; i++) {
            stack_html += '<div class="stack-entry"></div>';
            count++;
        }

        for (let i = this.stack.length - 1; i >= 0; i--) {
            stack_html += `<div class="stack-entry">${this.stack[i]}</div>`;
            count++;
        }

        this.stack_elem.innerHTML = stack_html;

        const STACK_ENTRY_ELEM = document.getElementsByClassName('stack-entry');
        for (const val of STACK_ENTRY_ELEM) {
            val.style.cssText = this.stack_entry_css;
        }
    };

    push = (value) => {
        if (value.length > 0) {
            if (this.stack.length < this.stack_size) {
                this.stack.push(value);
                this.#render_stack();
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
            this.#render_stack();
        } else {
            alert('The stack is empty!');
        }
    };
}