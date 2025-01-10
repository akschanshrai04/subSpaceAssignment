
import { Check, Info, Plus, Trash } from 'lucide-react'
import React, { useState , useEffect } from 'react';
import { Send, Youtube, AlertCircle } from 'lucide-react';
import { gql, useMutation } from '@apollo/client'
import { useAuthQuery } from '@nhost/react-apollo';
import { UUID } from 'crypto';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { get } from 'http';
import axios from 'axios';
import { convertToObject } from 'typescript';
import ReactMarkdown from "react-markdown";


function App() {
  // const textdata = `<p> \n <b><u>AI Agents with Reasoning</u></b>\n </p>\n <p>\n AI agents now possess the ability to reason, enabling them to think in a human-like manner. This involves autonomous problem-solving, multi-step logical reasoning, and displaying human-like decision-making capabilities. This is a significant advancement compared to previous rule-based systems with limited understanding and basic automation. These agents demonstrate true reasoning, deep comprehension, and intelligent decision-making.\n </p>\n <br>\n \n <p>\n <b><u>AI Agent Team</u></b>\n </p>\n <p>\n The AI agent team includes several specialized agents: a web scraper, a URL data extractor, and a blog writer. These agents are powered by Prais and A-agents. Additionally, a system operations agent is introduced that can handle multiple tasks with deep reflection and complex processes. This agent can reason through errors and provide alternative solutions, enhancing its robustness. \n </p>\n <br>\n \n <p>\n <b><u>System Operations Agent</u></b>\n </p>\n <p>\n The system operations agent performs multi-step tasks and provides a summary report. It has the ability to reflect on errors and find alternative solutions. The agent works through a list of tasks sequentially, and demonstrates error handling through self-reflection, fixing issues, and ensuring tasks are completed. the key difference of using this agent is the minimum reflection and maximum reflection setting.\n </p>\n <br>\n \n <p>\n <b><u>Creating AI Agents (Basic)</u></b>\n </p>\n <p>\n Creating basic AI agents involves only three commands: "pip install pron AI", "export open a API key", and "pron AI Auto". However, for adding reasoning features, code is required. The basic steps are:\n <ol>\n <li>Importing agent tasks and praison a agents.</li>\n <li>Defining a list of agents with an agent clause.</li>\n <li> Defining tasks for each agent.</li>\n <li> Calling the agents clause and running the agents.</li>\n </ol>\n </p>\n <br>\n \n \n <p>\n <b><u>Adding Reasoning to Agents</u></b>\n </p>\n <p>\n The "key change" comes from the "minimum reflect" and "maximum reflect" settings. For example, a system operations agent is given six tasks, so it requires a minimum of six reflections to step through each task. This enables step-by-step processing and error handling where the agent adds more reflective steps if errors occur.\n </p>\n <br>\n <p>\n <b><u>System Operations Agent Implementation</u></b>\n </p>\n <p>\n The system operations agent implementation involves three primary steps: \n <ol>\n <li> Creating tools (e.g., a run terminal command tool and a save to file tool).</li>\n <li> Creating the AI agent, defining its role as an expert system administrator, and setting reflection limits with minimum and maximum settings and assigning tools for use.</li>\n <li> Creating complex tasks that the agent performs (e.g., system information, processes, disk space, system load, and a final summary report).</li>\n \n </ol>\n The code uses the prais and a agents library to execute the agent and task in a sequential manner.\n </p>\n <br>\n \n\n <p>\n <b><u>Web Scraper, URL Data Extractor, and Blog Writer Agents</u></b>\n </p>\n <p>\n A demonstration is provided on how to build a web scraper, URL data extractor, and blog writer.The task is to scrape a webpage, extracts data from the URL's and write a blog on it. Here are the steps to Implement it:\n <ol>\n <li> Create an e2b tool to run the python code.</li>\n <li> Create agents for the web scraper, URL data extractor, and blog writer.</li>\n <li>Create tasks for each agent (e.g., URL extraction, data extraction, and blog writing).</li>\n <li>Assign tools to these agents.</li>\n </ol>\n These tasks would be done via a manager LLM with self reflection, and can be made more in-depth by setting min and max reflect as well.\n </p>\n <br>\n\n <p>\n <b><u>Final Steps and Execution</u></b>\n </p>\n <p>\n The final step involves putting all agents and tasks together using a hierarchical approach where a manager LLM controls all agents. The process is started using "agents.start()".The manager LLM provides self-reflection. The output is the scraped content for each task each done by different agents, and a blog post file based on extracted data.\n </p>\n <br>\n \n`;


  const [showsummary, setShowSummary] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");


  const { data, refetch: refetchSummaries } = useAuthQuery<{
    summaries: Array<{
      id: string;
      summary: string;
      youtube_url: string;
      created_at: Date;
    }>;
  }>(gql`
    query {
      summaries(order_by: { created_at: desc }) {
        id
        summary
        youtube_url
        created_at
      }
    }
  `);
    

  const [addSummary] = useMutation<{
    insertSummary?: {
      id: string;
      summary: string;
      youtube_url: Date;
    };
  }>(gql`
    mutation ($summary: String!, $youtube_url: String!) {
      insert_summaries(objects: { summary: $summary, youtube_url: $youtube_url }) {
        returning {
          id
          summary
          youtube_url
        }
      }
    }
  `);

  
  const handleAddSummary = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('https://n8n-dev.subspace.money/webhook/ytube', { youtubeUrl } , {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      const { data } = response;
      console.log("summary : ", data.summary);
      console.log("title : ", data.title);
      
      addSummary({
        variables: { summary : data.summary  , youtube_url: youtubeUrl },
        onCompleted: async () => {
          setShowSummary(`${data.summary}`);
          setTitle(data.title); 
          setSummary('');
          setYoutubeUrl('');
          await refetchSummaries();
          toast.success('Summary added successfully!');
          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
      setSummary(data.summary);
    } catch (error) {
      console.log("error in axios : ", error);
    }    
  };

  
    
  

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Youtube className="w-12 h-12 text-red-500 mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">YouTube Summarizer</h1>
          </div>
          
          <p className="text-gray-600 text-center mb-12">
            Get quick summaries of YouTube videos. Simply paste the video URL below.
          </p>

          <form onSubmit={handleAddSummary} 
            className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 shadow-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing video content...</p>
            </div>
          )}
          {showsummary && <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Summary</h2>
            <p className="text-gray-600">{showsummary}</p>
          </div>}
          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">How it works:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Paste a YouTube video URL in the input field above</li>
              <li>Click the send button or press enter</li>
              <li>Wait while our AI processes the video content</li>
              <li>Get a concise summary of the video's main points</li>
            </ol>
          </div>
          {/* <div style={{ padding: "20px" }}>
            <div dangerouslySetInnerHTML={{__html : textdata}} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;



