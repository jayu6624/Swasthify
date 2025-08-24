const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

class PythonAutoSetup {
  constructor() {
    this.pythonDir = __dirname;
    this.requirementsPath = path.join(this.pythonDir, "requirements.txt");
    this.setupScriptPath = path.join(this.pythonDir, "setup.py");
  }

  async checkPythonEnvironment() {
    console.log("🔍 Checking Python environment...");

    try {
      // Check if Python is available
      const pythonVersion = await this.runCommand("python", ["--version"]);
      console.log("✅ Python found:", pythonVersion.trim());

      // Check if required packages are installed
      const missingPackages = await this.checkRequiredPackages();

      if (missingPackages.length > 0) {
        console.log("📦 Installing missing Python packages...");
        await this.installRequirements();
      } else {
        console.log("✅ All Python packages are already installed");
      }

      return true;
    } catch (error) {
      console.error("❌ Python environment check failed:", error.message);
      return false;
    }
  }

  async checkRequiredPackages() {
    const requiredPackages = [
      { name: "google.generativeai", import: "google.generativeai" },
      { name: "PIL", import: "PIL" },
      { name: "requests", import: "requests" },
      { name: "dotenv", import: "dotenv" },
      { name: "absl.logging", import: "absl.logging" },
    ];

    const missingPackages = [];

    for (const pkg of requiredPackages) {
      try {
        await this.runCommand("python", ["-c", `import ${pkg.import}`]);
      } catch (error) {
        missingPackages.push(pkg.name);
      }
    }

    return missingPackages;
  }

  async installRequirements() {
    try {
      console.log("📥 Installing Python dependencies...");
      console.log("📁 Requirements path:", this.requirementsPath);

      // Change to the python directory first, then install
      await this.runCommand(
        "python",
        ["-m", "pip", "install", "-r", "requirements.txt"],
        { cwd: this.pythonDir }
      );

      console.log("✅ Python dependencies installed successfully!");
      return true;
    } catch (error) {
      console.error("❌ Failed to install Python dependencies:", error.message);
      console.log("💡 You can install manually by running:");
      console.log(`   cd ${this.pythonDir}`);
      console.log("   pip install -r requirements.txt");
      return false;
    }
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        stdio: ["pipe", "pipe", "pipe"],
        shell: true,
        cwd: options.cwd,
      });

      let output = "";
      let errorOutput = "";

      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
        }
      });

      process.on("error", (error) => {
        reject(error);
      });
    });
  }

  async testMealAnalyzer() {
    try {
      console.log("🧪 Testing meal analyzer...");

      // Simple file existence check
      const fs = require('fs');
      const analyzerPath = path.join(this.pythonDir, 'meal_analyzer.py');
      
      if (fs.existsSync(analyzerPath)) {
        console.log("✅ Meal analyzer script exists and is ready");
        return true;
      } else {
        throw new Error("Meal analyzer script not found");
      }
    } catch (error) {
      console.error("❌ Meal analyzer test failed:", error.message);
      return false;
    }
  }
}

module.exports = PythonAutoSetup;
