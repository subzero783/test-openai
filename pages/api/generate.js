import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      // temperature: 0.6,
      // temperature: 0,
      // max_tokens: 64,
      // top_p: 1,
      // frequency_penalty: 0,
      // presence_penalty: -2,
      // stop: ["\n\n"],
      temperature: 0,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n\n"]
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  // const capitalizedAnimal =
  //   animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  const userQuestion = animal;
  // return `Suggest three names for an animal that is a superhero.
  return `
Q: What is the AscentConnect mobile app?
A: AscentConnect, created by Ascent Funding, helps you apply for a loan and manage your payments easily. Borrowers can stay up-to-date on their loan balance to avoid missing a payment, and update billing information when needed. The AscentConnect mobile app is available only in the U.S. Apple App Store and the U.S. Google Play App Store.
Q: I can’t find the AscentConnect mobile app in the Apple App Store and Google Play Store. How can I download the app?
A: The AscentConnect mobile app is available only in the U.S. Apple App Store and the U.S. Google Play App Store. To download the AscentConnect mobile app, search for “AscentConnect” in the Apple App Store or Google Play Store.  
Q: How can I log into the AscentConnect mobile app?
A: To log into the AscentConnect mobile app, you can use the same Ascent login credentials as your Ascent account that you created when applying for your Ascent loan. If you’ve forgotten your credentials, select the “Forgot Password” link on the login page of the mobile app and then enter the email address you used when applying for your Ascent loan. If you’re still experiencing issues, please email us at TechSupport@AscentFunding.com. 
Q: Who do I reach out to if I'm experiencing issues with the AscentConnect mobile app?
A: If you’re experiencing issues with the AscentConnect mobile app, please email us at TechSupport@AscentFunding.com with the issue you are experiencing, the browser and device you’re using, version of iOS/operating system, and any screenshots if applicable.
Q: ${userQuestion}
A: `;
}
