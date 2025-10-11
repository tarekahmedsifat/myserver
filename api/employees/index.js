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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const employees = readEmployees();
    return res.status(200).json(employees);
  }

  if (req.method === "POST") {
    const employees = readEmployees();
    const newEmp = {
      id: employees.reduce((max, e) => Math.max(max, e.id), 0) + 1,
      ...req.body,
    };
    employees.push(newEmp);
    writeEmployees(employees);
    return res.status(201).json(newEmp);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
