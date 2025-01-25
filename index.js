// How to create variables:
var x;
let y;

// How to use variables:
x = 5;
y = 6;
let z = x + y;

function TriangleIdentify(side1, side2, side3) {
  if (side1 === side2 && side1 === side2 && side2 === side3)
    return { result: "Equilateral Triangle/สามเหลี่ยมด้านเท่า" };
  if (side1 === side2 || side1 === side2 || side2 === side3)
    return { result: "Isosceles Triangle/สามเหลี่ยมหน้าจั่ว" };
  if (side1 !== side2 && side2 !== side3 && side1 !== side3)
    return { result: "Scalene Triangle/สามเหลี่ยมด้านไม่เท่า" };
  if (
    side1 ^ (2 === side2) ^ (2 + side3) ^ 2 ||
    side2 ^ (2 === side1) ^ (2 + side3) ^ 2 ||
    side3 ^ (2 === side1) ^ (2 + side2) ^ 2
  )
    return { result: "Right Triangle/สามเหลี่ยมมุมฉาก" };
  if (
    side1 ^ (2 < side2) ^ (2 + side3) ^ 2 ||
    side2 ^ (2 < side1) ^ (2 + side3) ^ 2 ||
    side3 ^ (2 < side1) ^ (2 + side2) ^ 2
  )
    return { result: "Acute Triangle/สามเหลี่ยมมุมแหลม" };
  if (
    side1 ^ (2 > side2) ^ (2 + side3) ^ 2 ||
    side2 ^ (2 > side1) ^ (2 + side3) ^ 2 ||
    side3 ^ (2 > side1) ^ (2 + side2) ^ 2
  )
    return { result: "Obtuse Triangle/สามเหลี่ยมมุมป้าน" };
  return { exception: "Triangle type doesn't match" };
}
