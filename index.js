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
    updateTriangleImage("equilateral.png");
    return Output({ result: "Equilateral Triangle/สามเหลี่ยมด้านเท่า" });
  }

  // Check for Isosceles Triangle
  if (side1 === side2 || side1 === side3 || side2 === side3) {
    updateTriangleImage("isosceles.png");
    return Output({ result: "Isosceles Triangle/สามเหลี่ยมหน้าจั่ว" });
  }

  // Check for Right Triangle
  if (
    side1 ** 2 === side2 ** 2 + side3 ** 2 ||
    side2 ** 2 === side1 ** 2 + side3 ** 2 ||
    side3 ** 2 === side1 ** 2 + side2 ** 2
  ) {
    updateTriangleImage("right.png");
    return Output({ result: "Right Triangle/สามเหลี่ยมมุมฉาก" });
  }

  // Check for Acute Triangle
  if (
    side1 ** 2 > side2 ** 2 + side3 ** 2 ||
    side2 ** 2 > side1 ** 2 + side3 ** 2 ||
    side3 ** 2 > side1 ** 2 + side2 ** 2
  ) {
    updateTriangleImage("acute.png");
    return Output({ result: "Acute Triangle/สามเหลี่ยมมุมแหลม" });
  }

  // Check for Obtuse Triangle
  if (
    side1 ** 2 < side2 ** 2 + side3 ** 2 ||
    side2 ** 2 < side1 ** 2 + side3 ** 2 ||
    side3 ** 2 < side1 ** 2 + side2 ** 2
  ) {
    updateTriangleImage("obtuse.png");
    return Output({ result: "Obtuse Triangle/สามเหลี่ยมมุมป้าน" });
  }

  // Fallback case Scalene Triangle
  updateTriangleImage("scalene.png");
  return Output({ result: "Scalene Triangle/สามเหลี่ยมด้านไม่เท่า" });
}

//Show output
function Output(message) {
  if ("result" in message) return message.result;
  throw new Error(message.exception);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const resultText = document.querySelector(".type");
  const errorText = document.querySelector(".error-type");
  const errorContainer = document.querySelector(".error-container");
  const whiteContainer = document.querySelectorAll(".white-container")[1];

  errorContainer.style.display = "none"; // Hide error container initially
  whiteContainer.style.display = "none"; // Hide result container initially

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
      whiteContainer.style.display = "none"; // Hide white container
      return;
    }

    // Validate if it's a triangle
    const triangleValidation = ValidateTriangle(side1, side2, side3);
    if (!triangleValidation.isTriangle) {
      errorText.textContent = triangleValidation.error;
      errorContainer.style.display = "block"; // Show error container
      whiteContainer.style.display = "none"; // Hide white container
      return;
    }

    // Identify triangle type
    const triangleType = TriangleIdentify(side1, side2, side3);
    resultText.textContent = `The triangle is a ${triangleType}.`;
    errorContainer.style.display = "none"; // Hide error container
    whiteContainer.style.display = "block"; // Show white container with result
  });
});

function updateTriangleImage(imageName) {
  const triangleImage = document.querySelector(".triangle-image img");
  triangleImage.src = `./Triangles/${imageName}`;
}
