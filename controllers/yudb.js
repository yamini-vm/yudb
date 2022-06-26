const fs = require("fs");
const { execSync } = require("child_process");
const { FILE } = require("dns");

let OUTPUT = null;
let DEBUG_INFO = null;
let CODE_LINES = null;
let ASM_CODE_LINES = null;
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

let read_file = (file_path) => {
    try {
        const data = fs.readFileSync(file_path, 'utf8');
        return {
           "icon": "success",
           "data": data, 
        };
    } catch (err) {
        return {
            "icon": "error",
            "title": "Error",
            "text": err,
        };
    }
};

exports.postDebug = (req, res, next) => {
    const file_path = req.body.path;

    let result = perform_file_checks(file_path);
    if (result['icon'] == 'error') {
        return result;
    }

    result = read_file(file_path);
    if (result['icon'] == 'error') {
        return result;
    } else {
        const file_contents = result.data.split('\n');

        fs.writeFileSync("debug/asm_code_lines.json", JSON.stringify(file_contents, null, 4));
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

readJSONFile = (path) => {
    try {
        const debugInfo = fs.readFileSync(path, "utf8");
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
    if (DEBUG_INFO == null) {
        const result = readJSONFile("debug/debugging.json");
        if (result.icon == "error") {
            return result;
        }
        DEBUG_INFO = result;
    }

    if (CODE_LINES == null) {
        const result = readJSONFile("debug/code_lines.json");
        if (result.icon == "error") {
            return result;
        }
        CODE_LINES = result;
    }

    if (ASM_CODE_LINES == null) {
        const result = readJSONFile("debug/asm_code_lines.json");
        if (result.icon == "error") {
            return result;
        }
        ASM_CODE_LINES = result;
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
    for (line of CODE_LINES) {
        if (i == currentDebuggingDict.pc) {
            code += (i+1) + " - <span style='background-color: black; color: white'>" + line + " (" + ASM_CODE_LINES[i] + ")</span><br>";
        } else {
            code += (i+1) + " - " + line + " (" + ASM_CODE_LINES[i] + ")<br>";
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
        memory: currentDebuggingDict.a_data_memory,
    };
}

exports.postNextDebug = (req, res, next) => {
    return res.send(JSON.stringify(moveDebugPtr()));
}

exports.postResetDebug = (req, res, next) => {
    return res.send(JSON.stringify(moveDebugPtr(true)));
}