const text = "Let's begin.";
let index = 0;
const typewriter = document.getElementById("typewriter");
const startBtn = document.getElementById("startBtn");

function type() {
  if (index < text.length) {
    typewriter.innerHTML += text.charAt(index);
    index++;
    setTimeout(type, 100); // Delay between each character
  } else {
    // Loop the animation back and forth
    setTimeout(() => {
      typewriter.innerHTML = ""; // Clear the text
      index = 0; // Reset index to start over
      type(); // Restart typing animation
    }, 2000); // Wait for 1 second before restarting
  }
}

window.onload = type;
