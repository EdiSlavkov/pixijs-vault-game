const codeLength: number = 3;
enum Direction {
  clockwise = "clockwise",
  counterclockwise = "counterclockwise",
}
const formatDirectionString = (count: number, direction: Direction) =>
  `${count} ${direction}`;
export { codeLength, Direction, formatDirectionString };
