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
  
  // Set canvas size
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
  const baseScaleFactor = Math.min(width, height) * 0.6 / maxSide; // Reduced to ensure fit
  
  // Start with three points for the triangle
  let points = [];
  
  // Position triangle based on its type
  switch(type) {
    case "Equilateral":
      // All sides equal, create perfect equilateral triangle
      const height_eq = (sides[0] * Math.sqrt(3)) / 2;
      points = [
        {x: width/2, y: height/2 - height_eq * baseScaleFactor * 0.5},
        {x: width/2 - sides[0] * baseScaleFactor / 2, y: height/2 + height_eq * baseScaleFactor * 0.5},
        {x: width/2 + sides[0] * baseScaleFactor / 2, y: height/2 + height_eq * baseScaleFactor * 0.5}
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
        {x: width/2, y: height/2 - height_is * baseScaleFactor * 0.4},
        {x: width/2 - sides[baseIndex] * baseScaleFactor / 2, y: height/2 + height_is * baseScaleFactor * 0.6},
        {x: width/2 + sides[baseIndex] * baseScaleFactor / 2, y: height/2 + height_is * baseScaleFactor * 0.6}
      ];
      break;
      
    case "Right":
      // Center the right triangle better
      const rightScaleFactor = baseScaleFactor * 0.9;
      const rightHeight = Math.min(sides[0], sides[1]) * rightScaleFactor;
      const rightWidth = Math.max(sides[0], sides[1]) * rightScaleFactor;
      
      points = [
        {x: width/2 - rightWidth/2, y: height/2 + rightHeight/2},  // Bottom left (right angle)
        {x: width/2 - rightWidth/2, y: height/2 - rightHeight/2},  // Top left
        {x: width/2 + rightWidth/2, y: height/2 + rightHeight/2}   // Bottom right
      ];
      break;
      
    case "Obtuse":
      // Use a slightly larger scale factor for obtuse triangles
      const obtuseScaleFactor = baseScaleFactor * 1.1;
      
      // Calculate a rough estimate of the obtuse triangle's dimensions
      // Get the largest angle and its opposite side
      let maxAngleIndexObt = angles.indexOf(Math.max(...angles));
      let oppositeSide = sides[maxAngleIndexObt];
      
      // Generate triangle points with better centering
      // First calculate temporary points to get dimensions
      let tempPoints = generateTrianglePoints(sides, angles, obtuseScaleFactor);
      
      // Find the bounding box of the temporary triangle
      let minX = Math.min(tempPoints[0].x, tempPoints[1].x, tempPoints[2].x);
      let maxX = Math.max(tempPoints[0].x, tempPoints[1].x, tempPoints[2].x);
      let minY = Math.min(tempPoints[0].y, tempPoints[1].y, tempPoints[2].y);
      let maxY = Math.max(tempPoints[0].y, tempPoints[1].y, tempPoints[2].y);
      
      // Calculate offsets to center the triangle
      let offsetX = width/2 - (minX + maxX)/2;
      let offsetY = height/2 - (minY + maxY)/2;
      
      // Apply offsets to center the triangle
      points = tempPoints.map(p => ({
        x: p.x + offsetX,
        y: p.y + offsetY
      }));
      break;
      
    case "Acute":
    case "Scalene":
      // Generate triangle points
      let tempPointsAcute = generateTrianglePoints(sides, angles, baseScaleFactor);
      
      // Find the bounding box
      let minXAcute = Math.min(tempPointsAcute[0].x, tempPointsAcute[1].x, tempPointsAcute[2].x);
      let maxXAcute = Math.max(tempPointsAcute[0].x, tempPointsAcute[1].x, tempPointsAcute[2].x);
      let minYAcute = Math.min(tempPointsAcute[0].y, tempPointsAcute[1].y, tempPointsAcute[2].y);
      let maxYAcute = Math.max(tempPointsAcute[0].y, tempPointsAcute[1].y, tempPointsAcute[2].y);
      
      // Calculate offsets to center the triangle
      let offsetXAcute = width/2 - (minXAcute + maxXAcute)/2;
      let offsetYAcute = height/2 - (minYAcute + maxYAcute)/2;
      
      // Apply offsets to center the triangle
      points = tempPointsAcute.map(p => ({
        x: p.x + offsetXAcute,
        y: p.y + offsetYAcute
      }));
      break;
  }
  
  // Ensure all points are within canvas bounds with padding
  const padding = 30; // Padding from canvas edges in pixels
  let allPointsInBounds = points.every(p => 
    p.x >= padding && p.x <= width - padding && 
    p.y >= padding && p.y <= height - padding
  );
  
  // If any point is outside the bounds, rescale the triangle
  if (!allPointsInBounds) {
    // Calculate the current bounds
    let minX = Math.min(...points.map(p => p.x));
    let maxX = Math.max(...points.map(p => p.x));
    let minY = Math.min(...points.map(p => p.y));
    let maxY = Math.max(...points.map(p => p.y));
    
    // Calculate required scaling
    const currentWidth = maxX - minX;
    const currentHeight = maxY - minY;
    const availableWidth = width - 2 * padding;
    const availableHeight = height - 2 * padding;
    
    const scaleX = availableWidth / currentWidth;
    const scaleY = availableHeight / currentHeight;
    const rescale = Math.min(scaleX, scaleY, 1); // Don't upscale, only downscale if needed
    
    if (rescale < 1) {
      // Calculate the center of the triangle
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      // Rescale all points around the center
      points = points.map(p => ({
        x: centerX + (p.x - centerX) * rescale,
        y: centerY + (p.y - centerY) * rescale
      }));
    }
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
  
  // Add side labels with proper positioning
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';
  
  // Draw side labels with better positioning
  for (let i = 0; i < 3; i++) {
    const nextI = (i + 1) % 3;
    const dx = points[nextI].x - points[i].x;
    const dy = points[nextI].y - points[i].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate perpendicular offset direction
    const normalX = -dy / length * 20; // Offset distance
    const normalY = dx / length * 20;
    
    // First draw the "side #" label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `side ${i+1}`,
      midpoints[i].x + normalX,
      midpoints[i].y + normalY
    );
    
    // Then draw the length value below the label - display original value without rounding
    ctx.fillText(
      `${sides[i]}`,
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

// Helper function to generate initial triangle points based on sides and angles
function generateTrianglePoints(sides, angles, scaleFactor) {
  // Start with a base point
  const basePoint = {x: 100, y: 200};
  
  // Find the angle with the largest value (usually the obtuse angle if present)
  const maxAngleIndex = angles.indexOf(Math.max(...angles));
  
  // Get the two sides connected to the largest angle
  const side1 = sides[(maxAngleIndex + 1) % 3];
  const side2 = sides[(maxAngleIndex + 2) % 3];
  
  // Calculate the angle between these sides (in radians)
  const includedAngle = angles[maxAngleIndex] * Math.PI / 180;
  
  // Calculate the coordinates of the other two points
  const point2 = {
    x: basePoint.x + side1 * scaleFactor,
    y: basePoint.y
  };
  
  const point3 = {
    x: basePoint.x + side2 * scaleFactor * Math.cos(includedAngle),
    y: basePoint.y - side2 * scaleFactor * Math.sin(includedAngle)
  };
  
  return [basePoint, point2, point3];
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