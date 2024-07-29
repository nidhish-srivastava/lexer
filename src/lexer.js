class Lexer {
    constructor(input) {
        this.input = input
        this.position = 0
        this.tokens = []
        this.keywords = new Set(['if', 'else', 'for', 'while', 'return', 'function', 'var', 'let', 'const']);
    }
    tokenize() {
        while (this.position < this.input.length) {
            let char = this.input[this.position]

            // skip the whitespace
            if (/\s/.test(char)) {
                this.position++
                continue
            }
            // number token
            if (/\d/.test(char)) {
                this.tokens.push(this.readNumber())
                continue
            }
            // identifier token
            if (/[a-zA-Z_]/.test(char)) {
                this.tokens.push(this.readIdentifierOrKeyword())
                continue
            }
            // single line comment
            if (char === '/' && this.peek() === "/") {
                this.skipSingleLineComment();
                continue;
            }
            // multiline comment
            if (char === '/' && this.peek() === "*") {
                this.skipMultiLineComment()
                continue
            }
            // String token
            if (char === '"' || char === "'") {
                this.tokens.push(this.readString(char));
                continue;
            }
            // handle single character tokens
            switch (char) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                case '=':
                case '<':
                case '>':
                case '!':
                case '&':
                case '|':
                case '^':
                case '~':
                case '?':
                case ':':
                    this.tokens.push(this.readOperator());
                    break;
                case '(':
                case ')':
                case '{':
                case '}':
                case '[':
                case ']':
                case ',':
                case '.':
                case ';':
                    this.tokens.push({ type: 'punctuation', value: char });
                    this.position++;
                    break;
                default:
                    throw new Error(`Unexpected character: ${char}`);
            }
        }
        return this.tokens
    }

    readNumber() {
        let start = this.position
        while (/\d/.test(this.input[this.position])) {
            this.position++
        }
        return { type: 'number', value: this.input.slice(start, this.position) }
    }

    readIdentifierOrKeyword() {
        let start = this.position;
        while (/[a-zA-Z_]/.test(this.input[this.position])) {
            this.position++;
        }
        let value = this.input.slice(start, this.position);
        let type = this.keywords.has(value) ? 'keyword' : 'identifier';
        return { type, value };
    }
    readOperator() {
        let start = this.position;
        this.position++;
        // Handle multi-character operators (e.g., '==', '!=', '&&', '||')
        if (/^[=!<>]$/.test(this.input[start]) && this.input[this.position] === '=') {
            this.position++;
        }
        return { type: 'operator', value: this.input.slice(start, this.position) };
    }
    readString(quoteType) {
        let start = this.position;
        this.position++; // Skip the opening quote
        while (this.position < this.input.length && this.input[this.position] !== quoteType) {
            this.position++;
        }
        this.position++; // Skip the closing quote
        return { type: 'string', value: this.input.slice(start + 1, this.position - 1) };
    }
    skipSingleLineComment() {
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
            this.position++;
        }
        this.position++; // Skip the newline character
    }

    skipMultiLineComment() {
        while (this.position < this.input.length && !(this.input[this.position] === '*' && this.input[this.position + 1] === '/')) {
            this.position++;
        }
        this.position += 2; // Skip the closing '*/'
    }

    peek() {
        return this.position + 1 < this.input.length ? this.input[this.position + 1] : null;
    }
}

export { Lexer }