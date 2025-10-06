const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ---------- Helper functions ----------
const isAlphabet = (str) => /^[A-Za-z]+$/.test(str);
const isNumber = (str) => /^-?\d+(\.\d+)?$/.test(str);
const isSpecialChar = (str) => /^[^A-Za-z0-9]+$/.test(str);

// ---------- Main Route ----------
app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    // Set default values for user details
    const default_full_name = "john_doe";
    const default_email = "john@xyz.com";
    const default_college_roll_number = "ABCD123";
    const default_dob = "17091999";

    // Use values from the request body if they exist, otherwise use defaults
    const full_name = req.body.full_name || default_full_name;
    const email = req.body.email || default_email;
    const college_roll_number =
      req.body.college_roll_number || default_college_roll_number;
    const dob = req.body.dob || default_dob;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid input: 'data' must be an array.",
      });
    }

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_chars = [];
    let sum_of_numbers = 0;

    data.forEach((item) => {
      if (isNumber(item)) {
        const num = parseInt(item);
        sum_of_numbers += num;
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
      } else if (isAlphabet(item)) {
        alphabets.push(item.toUpperCase());
      } else if (isSpecialChar(item)) {
        special_chars.push(item);
      }
    });

    const concat_alpha = alphabets
      .join("")
      .split("")
      .reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase()))
      .join("");

    const user_id = `${full_name.toLowerCase().replace(/\s+/g, "_")}_${dob}`;

    return res.status(200).json({
      is_success: true,
      user_id,
      email,
      roll_number: college_roll_number,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters: special_chars,
      sum: String(sum_of_numbers),
      concat_string: concat_alpha,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      is_success: false,
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});