import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "api/employees.json");

function readEmployees() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data || "[]");
}

function writeEmployees(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;
  const employees = readEmployees();
  const empIndex = employees.findIndex((e) => e.id === Number(id));

  if (req.method === "GET") {
    if (empIndex === -1) return res.status(404).json({ message: "Employee not found" });
    return res.status(200).json(employees[empIndex]);
  }

  if (req.method === "PUT") {
    if (empIndex === -1) return res.status(404).json({ message: "Employee not found" });
    employees[empIndex] = { ...employees[empIndex], ...req.body };
    writeEmployees(employees);
    return res.status(200).json(employees[empIndex]);
  }

  if (req.method === "DELETE") {
    if (empIndex === -1) return res.status(404).json({ message: "Employee not found" });
    const updated = employees.filter((e) => e.id !== Number(id));
    writeEmployees(updated);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
