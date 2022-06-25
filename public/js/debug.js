document.addEventListener("DOMContentLoaded", () => {
    let dataStack = new Stack("data-stack", 5);
    let callStack = new Stack("call-stack", 5);

    const executeStackInstructions = (stackObj, instruction) => {
        switch (instruction.instruction) {
            case "PUSH":
                stackObj.push(instruction.arg);
                break;
            case "POP":
                stackObj.pop();
                break;
            default:
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Unknown instruction: " + instruction.instruction,
                });
        }
    }

    const moveDebugPtr = (cmd) => {
        $.ajax({
            url: `/${cmd}-debug`,
            type: 'post',
            dataType: 'json',
            data: {},
            success: function(result) {
                if (result.icon == "error") {
                    Swal.fire({
                        icon: result.icon,
                        title: result.title,
                        text: result.text,
                    });
                } else {
                    $("#code").html(result.code);
                    $("#pc").html(result.pc);
    
                    let i = 0;
                    $("#register").find('th').each((column, th) => {
                        $(th).html(result.register[i]);
                        i++;
                    });
    
                    i = 0;
                    const flag_register_values = Object.values(result.flagRegister);
                    $("#flag-register").find('th').each((column, th) => {
                        $(th).html(flag_register_values[i] ? 1 : 0);
                        i++;
                    });

                    const stackInstructions = result.stack;
                    for (instruction of stackInstructions) {
                        executeStackInstructions(dataStack, instruction);
                    }

                    const callStackInstructions = result.callStack;
                    for (instruction of callStackInstructions) {
                        executeStackInstructions(callStack, instruction);
                    }
                }
            },
        });
    }

    moveDebugPtr("next");

    $("#next-debug").click(() => {
        moveDebugPtr("next");
    })

    $("#reset-debug").click(() => {
        moveDebugPtr("reset");

        dataStack.reset();
        callStack.reset();
    })
});