import { AISdkClient, Stagehand } from '@browserbasehq/stagehand';
import { generateText } from 'ai';
import { z } from 'zod';
import { chromium } from 'playwright';
import { createOpenAI } from '@ai-sdk/openai';
import { createXai } from '@ai-sdk/xai';

const API_KEY = 'your-key';
const openai = createOpenAI({
    baseURL: 'https://jp.duckcoding.com/v1',
    apiKey: API_KEY,
});

// 设置环境变量
process.env['OPENAI_API_KEY'] = API_KEY;

const testLLM = async model => {
    try {
        const { text } = await generateText({
            model: model,
            prompt: 'hello',
        });
        console.log('test:', text);
        return true;
    } catch (e) {
        console.log('test error:', e);
        return false;
    }
};

const run = async () => {
    console.log(`Running stagehand`);

    // const aiModel = openai('gpt-4o');
    // await testLLM(aiModel);
    const stagehand = new Stagehand({
        env: 'LOCAL',
        modelName: 'gpt-4o',
        modelClientOptions: {
            baseURL: 'https://jp.duckcoding.com/v1',
            apiKey: API_KEY,
        },
        // llmClient: new AISdkClient({
        //     model: aiModel,
        // }),
        localBrowserLaunchOptions: {
            executablePath: chromium.executablePath(),
        },
    });

    await stagehand.init();
    const page = stagehand.page;

    await page.goto('https://github.com/trending');
    // ============= Example 1 ===========
    // if you want to get an array, must use z.object to wrap z.array
    const info = await page.extract({
        instruction: 'extract all PRs title,time,author',
        schema: z.object({
            prs: z.array(
                z.object({
                    prTitle: z.string(),
                    time: z.string(),
                    author: z.string(),
                }),
            ),
        }),
    });

    console.log('pr:', info);

    // ============= Example 2 ===========

    const info2 = await page.extract({
        instruction: 'extract all projects, get their title,spec,stars number,fork number,today’s stars, language',
        schema: z.object({
            prs: z.array(
                z.object({
                    title: z.string(),
                    spec: z.string(),
                    stars: z.number(),
                    forks: z.number(),
                    starsToday: z.number(),
                    language: z.string(),
                }),
            ),
        }),
    });
    console.log('info:', info2);
};

run();
