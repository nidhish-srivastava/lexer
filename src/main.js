import { Lexer } from "./lexer.js";

const input = `
let x = 42;
if (x > 10) {
  console.log("x is greater than 10");
}
`;
const lexer = new Lexer(input)
const tokens = lexer.tokenize()
console.log(tokens);
