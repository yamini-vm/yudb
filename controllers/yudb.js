const fs = require("fs");
const { execSync } = require("child_process");

let OUTPUT = null;
let DEBUG_INFO = null;
let PTR = -1;

exports.getIndex = (req, res, next) => {
    res.render('index', { 
       docTitle: 'Path to ASM file',
       jsFile: "index.js",
       isDebuggingMode: false,
    });
};

let check_correct_extension = (file_path, extension) => {
    if (!file_path.endsWith("." + extension)) {
        return {
            "icon": "error",
            "title": "Error",
            "text": "File is not a " + extension + " file!",
        };
    }

    return {
        "icon": "success",
    };
}

let check_file_exists = (file_path) => {
    if (!fs.existsSync(file_path)) {
        return {
            "icon": "error",
            "title": "Error",
            "text": "File path does not exist!",
        };
    }

    return {
        "icon": "success",
    };
};

let perform_file_checks = (file_path) => {
    let result;

    result = check_correct_extension(file_path, "yas");
    if (result['icon'] == 'error') {
        return result;
    }

    result = check_file_exists(file_path);
    if (result['icon'] == 'error') {
        return result;
    }

    return {
        "icon": "success",
    }
}

exports.postDebug = (req, res, next) => {
    const file_path = req.body.path;

    const result = perform_file_checks(file_path);
    if (result['icon'] == 'error') {
        return result;
    }

    let command = `yamasm ${file_path} -o tmp`;
    execSync(command);
    command = "yamini tmp -d";
    OUTPUT = execSync(command).toString();

    return res.send(JSON.stringify({
        "icon": "success",
        "title": "Success",
        "text": "Debugging information generated successfully!",
        "url": "/debug",
    }));
};

exports.getDebug = (req, res, next) => {
    res.render('debug', { 
       docTitle: 'Debug Mode',
       jsFile: "debug.js",
       isDebuggingMode: true,
    });
};

readDebuggingInfo = () => {
    try {
        const debugInfo = fs.readFileSync("debug/debugging.json", "utf8");
        return JSON.parse(debugInfo);
    } catch (err) {
        return {
            "icon": "error",
            "title": "Error",
            "text": err.message,
        };
    }
}

const moveDebugPtr = (isReset=false) => {
    const result = readDebuggingInfo();

    if (result.icon == "error") {
        return result;
    }

    if (DEBUG_INFO == null) {
        DEBUG_INFO = result;
    }

    if (isReset) {
        PTR = -1;
    }

    PTR++;

    if (PTR >= DEBUG_INFO.length) {
        return {
            "icon": "error",
            "title": "Error",
            "text": "Reset to start again!"
        };
    }

    let currentDebuggingDict = DEBUG_INFO[PTR];

    let code = "<pre>";

    let i = 0;
    for (debugDict of DEBUG_INFO) {
        if (i == currentDebuggingDict.pc) {
            code += "<span style='background-color: black; color: white'>" + debugDict.instruction + "</span><br>";
        } else {
            code += debugDict.instruction + "<br>";
        }
        i++;
    }

    code += "</pre>";

    return {
        icon: "success",
        title: "Success",
        text: "Loaded debugging information!",
        code: code,
        pc: currentDebuggingDict.pc,
        register: currentDebuggingDict.a_registers,
        flagRegister: currentDebuggingDict.a_flag_register,
        stack: currentDebuggingDict.stack,
        callStack: currentDebuggingDict.call_stack,
    };
}

exports.postNextDebug = (req, res, next) => {
    return res.send(JSON.stringify(moveDebugPtr()));
}

exports.postResetDebug = (req, res, next) => {
    return res.send(JSON.stringify(moveDebugPtr(true)));
}