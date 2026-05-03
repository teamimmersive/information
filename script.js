const canvas = document.querySelector("#soundfield");
const context = canvas.getContext("2d");
const toggle = document.querySelector("#motionToggle");
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".work-card");

let running = true;
let frame = 0;

const resize = () => {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.clientWidth * scale);
  canvas.height = Math.floor(canvas.clientHeight * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
};

const draw = () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);

  const centerX = width * 0.52;
  const centerY = height * 0.52;
  const maxRadius = Math.max(width, height) * 0.76;

  context.lineWidth = 1;
  for (let i = 0; i < 18; i += 1) {
    const radius = (maxRadius / 18) * i + ((frame * 0.35) % 26);
    context.beginPath();
    context.ellipse(centerX, centerY, radius * 1.05, radius * 0.58, -0.18, 0, Math.PI * 2);
    context.strokeStyle = `rgba(255, 250, 241, ${0.18 - i * 0.006})`;
    context.stroke();
  }

  const points = [
    { x: 0.2, y: 0.3, color: "217, 154, 43" },
    { x: 0.76, y: 0.26, color: "29, 119, 114" },
    { x: 0.34, y: 0.78, color: "180, 60, 36" },
    { x: 0.84, y: 0.7, color: "255, 250, 241" },
  ];

  points.forEach((point, index) => {
    const orbit = frame * (0.012 + index * 0.002);
    const x = width * point.x + Math.cos(orbit + index) * 34;
    const y = height * point.y + Math.sin(orbit * 1.4 + index) * 26;
    const glow = context.createRadialGradient(x, y, 0, x, y, 150);
    glow.addColorStop(0, `rgba(${point.color}, 0.55)`);
    glow.addColorStop(1, `rgba(${point.color}, 0)`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, 150, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = `rgba(${point.color}, 0.95)`;
    context.beginPath();
    context.arc(x, y, 4 + index, 0, Math.PI * 2);
    context.fill();
  });

  if (running) {
    frame += 1;
    requestAnimationFrame(draw);
  }
};

toggle.addEventListener("click", () => {
  running = !running;
  toggle.setAttribute("aria-pressed", String(running));
  toggle.querySelector("span").textContent = running ? "⏸" : "▶";
  if (running) {
    draw();
  }
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;

    filters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    cards.forEach((card) => {
      card.classList.toggle("is-hidden", category !== "all" && card.dataset.category !== category);
    });
  });
});

window.addEventListener("resize", resize);
resize();
draw();
