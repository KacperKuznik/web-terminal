import CUSTOM_COMMANDS from './customCommands.js';
import BUILTIN_COMMANDS from './builtinCommands.js';

const command_keys = Object.keys(BUILTIN_COMMANDS).concat(Object.keys((CUSTOM_COMMANDS)))
const input = document.getElementById('terminal-input');
const output = document.getElementById('terminal-output');

let commandHistory = [];
let historyIndex = 0;

const currentDate = new Date();
const formattedDate = formatDate(currentDate);
output.innerText = `Last login: ${formattedDate}\n`

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const value = input.value.trim();
        if (value !== '') {
            commandHistory.push(value);
            historyIndex = commandHistory.length;
            processCommand(value);
            input.value = '';
        }
    }
    else if (event.key === 'Tab') {
        event.preventDefault();
        autocomplete();
    }
    else if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    }
    else if (event.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        }
        else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }
});

function formatDate(date) {
    return `${date.toLocaleString('en-US', {weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'})}`;
}

function processCommand(command) {
    output.innerText += `you: ${command}\n`;
    const args = command.split(' ');
    const cmd = args[0];
    switch (cmd) {
        case 'clear':
            clearTerminal();
            break;
        case 'help':
            showHelp();
            break;
        case 'quote':
            fetchQuote();
            break;
        default:
            if (cmd.startsWith('double')) {
                const num = parseFloat(args[1]);
                if (!isNaN(num)) {
                    outputCommand(num * 2);
                }
                else {
                    outputCommand('Invalid command, type double X, where X is a number');
                }
            }
            else if (CUSTOM_COMMANDS.hasOwnProperty(cmd)) {
                outputCommand(CUSTOM_COMMANDS[cmd].msg);
            }
            else {
                outputCommand('Command not found');
            }
            break;
    }
}

function autocomplete() {
    let firstMatch = command_keys.find(element => element.startsWith(input.value));
    input.value = firstMatch || input.value;
}

function clearTerminal() {
    output.innerText = '';
}

function showHelp() {
    let helpText = 'Available commands:'
    for (const command in BUILTIN_COMMANDS) {
        helpText += `\n${command} - ${BUILTIN_COMMANDS[command]?.description}`
      }
    helpText += '\nOther custom commands:'
    for (const command in CUSTOM_COMMANDS) {
        helpText += `\n${command} - ${CUSTOM_COMMANDS[command]?.description}`
    }
    outputCommand(helpText);
}

function fetchQuote() {
    fetch('https://dummyjson.com/quotes/random')
        .then(response => response.json())
        .then(data => {
            outputCommand(data.quote);
        })
        .catch(error => {
            outputCommand('Error fetching quote');
        });
}

function outputCommand(outputText) {
    output.innerText += `terminal: ${outputText}\n`;
}
