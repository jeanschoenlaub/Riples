// pages/api/scheduled-tasks/botActivity.js
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const prisma = new PrismaClient();

// If you want to run this as an API route, make sure to secure it properly
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      await botActivity();
      return res.status(200).json({ message: 'Bot activity initiated' });
    } else {
      return res.status(405).end();
    }
}  

export async function botActivity() {
    console.log("called")
  // Find a random bot user
  const botUsers = await prisma.user.findMany({
    where: { isBot: true },
  });
  const randomBotUser = botUsers[Math.floor(Math.random() * botUsers.length)];

  // Perform bot actions
  if (randomBotUser) {
    forumBotHelper(randomBotUser.id).then(() => {
        // Handle the resolved promise if necessary.
      })
      .catch((error) => {
        // Handle any errors that occur during the execution of the promise.
        console.error(error);
      });
  }
}


async function forumBotHelper(botUserId: string) {
    // Get all forum questions less than a day old
    const recentQuestions = await prisma.forumQuestion.findMany({
      where: {
        createdAt: {
          gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
  
    console.log(recentQuestions)
    for (const question of recentQuestions) {
        
      const questionTitle = question.content;
  
      // We directly call the service function to generate the answer
      try {
        const responseChoices = await generateForumBotAnswer(questionTitle);
        
        // Process the raw data for tasks or goals to get a single string response
        const responseText = processRawDataForForumAnswer(responseChoices);

        console.log(responseText)
  
        // Post the response to the forum as the bot user
        if (responseText) {
          await prisma.forumAnswers.create({
            data: {
              userId: botUserId,
              questionId: question.id,
              content: responseText,
            },
          });
        }
      } catch (error) {
        console.error("Error generating forum answer:", error);
      }
    }
  }

  export const generateForumBotAnswer= async (questionTitle: string) => {
    const prompt = `
    Provide a helpful response to the forum question titled: "${questionTitle}"
    `;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_BOT });
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
}
  
function processRawDataForForumAnswer(rawData: OpenAI.Chat.Completions.ChatCompletion.Choice[]): string {
    let responseText = '';
    if (rawData?.[0] &&rawData.length > 0) {
      const messageContent = rawData[0].message.content;
      if (messageContent) {
        responseText = messageContent.trim();
      }
    }
    return responseText;
}
  
