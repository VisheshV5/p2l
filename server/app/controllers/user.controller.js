const db = require("../models");
const User = db.user;
const Job = db.job;

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const uploadProfileImage = async (req, res) => {
  const userId = req.params.userId;
  const { file } = req;

  try {
    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.profileImage.data = file.buffer;
    user.profileImage.contentType = file.mimetype;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile image updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProfileImage = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.profileImage.data || !user.profileImage.contentType) {
      return res
        .status(404)
        .json({ message: "Profile image not found for this user." });
    }

    res.set("Content-Type", user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, fName, lName, number, country, city, email } = req.body;
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    if (fName) {
      user.fName = fName;
    }

    if (lName) {
      user.lName = lName;
    }

    if (number) {
      user.number = number;
    }

    if (country) {
      user.country = country;
    }

    if (city) {
      user.city = city;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const findById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const matchTags = async (req, res) => {
  const jobs = await Job.find().exec();
  const { skills } = req.body;
  try {
    console.log(skills);
    const userSkills = skills;
    let finalJobs = [];
    jobs.forEach((job) => {
      const matchedJob = job.skills.filter((skill) =>
        userSkills.includes(skill)
      );
      if (matchedJob.length !== 0) {
        finalJobs.push({ ...job, matchedSkills: matchedJob });
      }
    });
    console.log(finalJobs);
    res.send({ message: finalJobs });

    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

const createPreferences = async (req, res) => {
  const { location, exp, skills, role, salary } = req.body;
  let retryCount = 3;

  const format = [
    {
      dreamJob: "specific Dream Job",
      dailySchedule: [
        "When they should wake up",
        "what they should do after that",
        "what after that",
        "after that",
        "after that",
        "etc etc until schedule is complete for 24 hours",
      ],
      recommendedSteps: [
        "Step 1 to goal",
        "Step 2 to goal",
        "Step 3 to goal",
        "Step 4 to goal",
        "Step 5 to goal",
        "Step 6 to goal",
      ],
      contact: [
        {
          name: "name",
          instagram: "instagram link",
          linkedin: "linkedin link",
        },
      ],
    },
  ];

  while (retryCount > 0) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI that is able to generate a persons dream job, as specific as possible. For example, should say Full Stack Developer, instead of just Software Developer, recommended steps to get there, and what their daily schedule should look like to get there, the length of each answer should not be more than 20 words. and you should make a contact list of 5 real people that are alive on planet earth that would be good for the user to network with to reach the goals. store the recommended steps and daily schedule and dream job and contacts in a JSON array. \nYou are to output the following in json format: ${JSON.stringify(
              format
            )} \nDo not put quotation marks or escape character \\ in the output fields.`,
          },
          {
            role: "user",
            content: `You are to generate a specific dream job tailored to the user, generate a list of 5 contacts of real people, not fake people, for the user to network with linkedin and instagram links, daily schedule the user must follow in order to reach their dream job, and recommendeded steps to get their prefered dream job as a ${role}, they have ${exp} years of experience, they are aiming for $${salary} per hour, their skills are: ${skills}, and they live in ${location}`,
          },
        ],
        temperature: 0,
        max_tokens: 900,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      });

      const message = response.choices[0].message.content;
      const startIndex = message.indexOf("[");
      const endIndex = message.lastIndexOf("]") + 1;

      const jsonArrayString = message.slice(startIndex, endIndex);
      const finalList = JSON.parse(jsonArrayString);
      console.log("FIANSFJKNDFSKNDFJKDFHKDF", finalList[0]);

      const user = await User.findById(req.params.userId);

      user.details = { location, exp, skills, role, salary };
      const preferences = {
        dreamJob: finalList[0]?.dreamJob,
        dailySchedule: finalList[0]?.dailySchedule,
        recommendedSteps: finalList[0]?.recommendedSteps,
        contacts: finalList[0]?.contact,
      };
      user.preferences = preferences;
      await user.save();

      res.send({ message: preferences });

      return;
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }

  res.status(500).send("Failed to generate quiz with the expected format");
};

module.exports = {
  uploadProfileImage,
  getProfileImage,
  updateProfile,
  findById,
  getAll,
  matchTags,
  createPreferences,
};
