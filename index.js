// Input Validation Module
function ValidateInputs(side1, side2, side3) {
  try {
    // Check if there are exactly three inputs
    if (arguments.length !== 3) {
      throw new Error("Please complete all fields with valid numbers.");
    }

    // Check if all inputs are numbers
    const sides = [side1, side2, side3];
    if (!sides.every((side) => typeof side === "number")) {
      throw new Error("Input numbers only, please.");
    }

    // Check if numbers are in the correct format (e.g., not 3.1.2)
    if (!sides.every((side) => /^\d+(\.\d+)?$/.test(side.toString()))) {
      throw new Error("Please input a valid number, for example, 3.5");
    }

    // Check if numbers have no more than 2 decimal places
    if (
      !sides.every(
        (side) =>
          side.toString().split(".")[1]?.length <= 2 ||
          !side.toString().includes(".")
      )
    ) {
      throw new Error("Decimal numbers should not exceed two decimal places.");
    }

    // Check if numbers are within the valid range (greater than 0 and not exceeding 10,000)
    if (!sides.every((side) => side > 0 && side <= 10000)) {
      if (sides.some((side) => side <= 0)) {
        throw new Error("Side length cannot be 0 or negative.");
      }
      if (sides.some((side) => side > 10000)) {
        throw new Error(
          "Error: The length exceeds the allowed limit (10,000)."
        );
      }
    }

    return { isValid: true, sides };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}

// Triangle Validation Module
function ValidateTriangle(side1, side2, side3) {
  try {
    // Validate triangle inequality theorem
    if (
      side1 + side2 > side3 &&
      side1 + side3 > side2 &&
      side2 + side3 > side1
    ) {
      return { isTriangle: true, sides: [side1, side2, side3] };
    } else {
      throw new Error("Not a triangle");
    }
  } catch (error) {
    return { isTriangle: false, error: error.message };
  }
}

function TriangleIdentify(side1, side2, side3) {
  // Check for Equilateral Triangle
  if (side1 === side2 && side2 === side3) {
    drawTriangle("Equilateral", [side1, side2, side3]);
    return Output({ result: "Equilateral Triangle/สามเหลี่ยมด้านเท่า" });
  }

  // Check for Isosceles Triangle
  if (side1 === side2 || side1 === side3 || side2 === side3) {
    drawTriangle("Isosceles", [side1, side2, side3]);
    return Output({ result: "Isosceles Triangle/สามเหลี่ยมหน้าจั่ว" });
  }

  // Check for Right Triangle
  if (
    Math.abs(side1 * side1 - (side2 * side2 + side3 * side3)) < 0.01 ||
    Math.abs(side2 * side2 - (side1 * side1 + side3 * side3)) < 0.01 ||
    Math.abs(side3 * side3 - (side1 * side1 + side2 * side2)) < 0.01
  ) {
    drawTriangle("Right", [side1, side2, side3]);
    return Output({ result: "Right Triangle/สามเหลี่ยมมุมฉาก" });
  }

  // Get the square of sides for angle calculations
  const a2 = side1 * side1;
  const b2 = side2 * side2;
  const c2 = side3 * side3;

  // Check for Obtuse Triangle (one angle > 90°)
  if (
    a2 > b2 + c2 ||
    b2 > a2 + c2 ||
    c2 > a2 + b2
  ) {
    drawTriangle("Obtuse", [side1, side2, side3]);
    return Output({ result: "Obtuse Triangle/สามเหลี่ยมมุมป้าน" });
  }

  // Check for Acute Triangle (all angles < 90°)
  if (
    a2 < b2 + c2 &&
    b2 < a2 + c2 &&
    c2 < a2 + b2
  ) {
    drawTriangle("Acute", [side1, side2, side3]);
    return Output({ result: "Acute Triangle/สามเหลี่ยมมุมแหลม" });
  }

  // Fallback case Scalene Triangle
  drawTriangle("Scalene", [side1, side2, side3]);
  return Output({ result: "Scalene Triangle/สามเหลี่ยมด้านไม่เท่า" });
}

function Output(message) {
  if ("result" in message) return message.result;
  throw new Error(message.exception);
}

// Calculate triangle angles using the law of cosines
function calculateAngles(sides) {
  const [a, b, c] = sides;
  
  // Use Law of Cosines to calculate angles
  // cos(A) = (b² + c² - a²) / (2bc)
  const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI);
  const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
  const angleC = Math.acos((a * a + b * b - c * c) / (2 * a * b)) * (180 / Math.PI);
  
  return [angleA, angleB, angleC];
}

// Function to draw triangle on canvas
function drawTriangle(type, sides) {
  const canvas = document.getElementById('triangleCanvas');
  if (!canvas) return;
  
  // Increase canvas size to make the triangle larger
  canvas.width = 350;
  canvas.height = 300;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Calculate angles
  const angles = calculateAngles(sides);
  
  // Set scale factor based on the max side length to make triangle fill more of the canvas
  const maxSide = Math.max(...sides);
  const scaleFactor = Math.min(width, height) * 0.8 / maxSide;
  
  // Start with three points for the triangle
  let points = [];
  
  // Position triangle based on its type
  switch(type) {
    case "Equilateral":
      // All sides equal, create perfect equilateral triangle
      const height_eq = (sides[0] * Math.sqrt(3)) / 2;
      points = [
        {x: width/2, y: height/2 - height_eq * scaleFactor * 0.6},
        {x: width/2 - sides[0] * scaleFactor / 2, y: height/2 + height_eq * scaleFactor * 0.4},
        {x: width/2 + sides[0] * scaleFactor / 2, y: height/2 + height_eq * scaleFactor * 0.4}
      ];
      break;
      
    case "Isosceles":
      // Find the two equal sides
      let baseIndex;
      if (sides[0] === sides[1]) baseIndex = 2;
      else if (sides[0] === sides[2]) baseIndex = 1;
      else baseIndex = 0;
      
      // Calculate height using the formula for triangle area
      const s = (sides[0] + sides[1] + sides[2]) / 2; // semi-perimeter
      const area = Math.sqrt(s * (s - sides[0]) * (s - sides[1]) * (s - sides[2]));
      const height_is = 2 * area / sides[baseIndex];
      
      points = [
        {x: width/2, y: height/2 - height_is * scaleFactor * 0.7},
        {x: width/2 - sides[baseIndex] * scaleFactor / 2, y: height/2 + height_is * scaleFactor * 0.3},
        {x: width/2 + sides[baseIndex] * scaleFactor / 2, y: height/2 + height_is * scaleFactor * 0.3}
      ];
      break;
      
    case "Right":
      // Place the right angle at the bottom left
      points = [
        {x: width/3, y: height/2 + sides[0] * scaleFactor / 2},
        {x: width/3, y: height/2 - sides[1] * scaleFactor / 2},
        {x: width/3 + sides[2] * scaleFactor, y: height/2 + sides[0] * scaleFactor / 2}
      ];
      break;
      
    case "Obtuse":
    case "Acute":
    case "Scalene":
      // Generate coordinates using angles and law of sines
      // Use the largest angle for the bottom corner
      let maxAngleIndex = angles.indexOf(Math.max(...angles));
      let bottomPoint = {x: width/2, y: height * 0.75};
      
      // Calculate the other two points using trigonometry
      // Arrange sides so that the largest angle is between sides[0] and sides[1]
      let rearrangedSides = [
        sides[(maxAngleIndex + 1) % 3],
        sides[(maxAngleIndex + 2) % 3],
        sides[maxAngleIndex]
      ];
      
      let angle1 = calculateAngles(rearrangedSides)[0];
      let angle2 = calculateAngles(rearrangedSides)[1];
      
      points = [
        bottomPoint,
        {
          x: bottomPoint.x - rearrangedSides[0] * scaleFactor * Math.cos(angle2 * Math.PI/180),
          y: bottomPoint.y - rearrangedSides[0] * scaleFactor * Math.sin(angle2 * Math.PI/180)
        },
        {
          x: bottomPoint.x + rearrangedSides[1] * scaleFactor * Math.cos(angle1 * Math.PI/180),
          y: bottomPoint.y - rearrangedSides[1] * scaleFactor * Math.sin(angle1 * Math.PI/180)
        }
      ];
      break;
  }
  
  // Draw the triangle outline
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
  
  // Draw border in black (no fill)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw angle arcs
  const arcRadius = 20; // Radius for the angle arc
  
  for (let i = 0; i < 3; i++) {
    // Get vectors to the other two points
    const nextI = (i + 1) % 3;
    const prevI = (i + 2) % 3;
    
    // Calculate vectors
    const v1x = points[nextI].x - points[i].x;
    const v1y = points[nextI].y - points[i].y;
    const v2x = points[prevI].x - points[i].x;
    const v2y = points[prevI].y - points[i].y;
    
    // Normalize vectors
    const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const len2 = Math.sqrt(v2x * v2x + v2y * v2y);
    
    const n1x = v1x / len1;
    const n1y = v1y / len1;
    const n2x = v2x / len2;
    const n2y = v2y / len2;
    
    // Calculate angle between vectors
    let angle = Math.atan2(v2y, v2x) - Math.atan2(v1y, v1x);
    if (angle < 0) angle += 2 * Math.PI;
    
    // Draw arc
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, arcRadius, 
            Math.atan2(v1y, v1x), 
            Math.atan2(v2y, v2x), 
            angle > Math.PI);
    ctx.stroke();
  }
  
  // Calculate side midpoints for labels
  const midpoints = [
    {x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2},
    {x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2},
    {x: (points[2].x + points[0].x) / 2, y: (points[2].y + points[0].y) / 2}
  ];
  
  // Add side labels with proper positioning similar to the example image
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';
  
  // Draw side labels with better positioning
  for (let i = 0; i < 3; i++) {
    const nextI = (i + 1) % 3;
    const dx = points[nextI].x - points[i].x;
    const dy = points[nextI].y - points[i].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate perpendicular offset direction
    const normalX = -dy / length * 25; // Increase offset to move further away
    const normalY = dx / length * 25;
    
    // First draw the "side #" label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `side ${i+1}`,
      midpoints[i].x + normalX,
      midpoints[i].y + normalY
    );
    
    // Then draw the length value below the label
    ctx.fillText(
      sides[i].toFixed(1),
      midpoints[i].x + normalX,
      midpoints[i].y + normalY + 15 // Position below side label
    );
  }
  
  // Add angles with better positioning
  ctx.font = '12px Arial';
  for (let i = 0; i < 3; i++) {
    // Position angle text inside the triangle near the arcs
    const nextI = (i + 1) % 3;
    const prevI = (i + 2) % 3;
    
    // Vector from current point to next point
    const v1x = points[nextI].x - points[i].x;
    const v1y = points[nextI].y - points[i].y;
    
    // Vector from current point to prev point
    const v2x = points[prevI].x - points[i].x;
    const v2y = points[prevI].y - points[i].y;
    
    // Normalize vectors and get their midpoint
    const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const len2 = Math.sqrt(v2x * v2x + v2y * v2y);
    
    const dirX = (v1x / len1 + v2x / len2) / 2;
    const dirY = (v1y / len1 + v2y / len2) / 2;
    
    // Position the angle text closer to the vertex
    const angleDirLen = Math.sqrt(dirX * dirX + dirY * dirY);
    const offsetX = dirX / angleDirLen * 20;
    const offsetY = dirY / angleDirLen * 20;
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `${Math.round(angles[i])}°`,
      points[i].x + offsetX,
      points[i].y + offsetY
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const resultText = document.querySelector(".type");
  const errorText = document.querySelector(".error-type");
  const errorContainer = document.querySelector(".error-container");
  const resultContainer = document.querySelector(".result-container");

  errorContainer.style.display = "none"; // Hide error container initially
  resultContainer.style.display = "none"; // Hide result container initially

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload

    // Get input values
    const side1 = parseFloat(document.getElementById("side1").value);
    const side2 = parseFloat(document.getElementById("side2").value);
    const side3 = parseFloat(document.getElementById("side3").value);

    // Validate inputs
    const inputValidation = ValidateInputs(side1, side2, side3);
    if (!inputValidation.isValid) {
      errorText.textContent = inputValidation.error;
      errorContainer.style.display = "block"; // Show error container
      resultContainer.style.display = "none"; // Hide result container
      return;
    }

    // Validate if it's a triangle
    const triangleValidation = ValidateTriangle(side1, side2, side3);
    if (!triangleValidation.isTriangle) {
      errorText.textContent = triangleValidation.error;
      errorContainer.style.display = "block"; // Show error container
      resultContainer.style.display = "none"; // Hide result container
      return;
    }

    // Identify triangle type
    const triangleType = TriangleIdentify(side1, side2, side3);
    resultText.textContent = `The triangle is a ${triangleType}.`;
    errorContainer.style.display = "none"; // Hide error container
    resultContainer.style.display = "block"; // Show result container with result
  });
});