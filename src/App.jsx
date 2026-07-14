import { useState, useEffect, useRef } from "react";
import "./App.css";
import { URL } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
  JSON.parse(localStorage.getItem("history")) || []
);
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);

  const askQuestion = async () => {
    try {
      if (!question.trim() && !selectedHistory) return false;

      if (question) {
        if (localStorage.getItem("history")) {
          let history = JSON.parse(localStorage.getItem("history"));
          history = history.slice(0, 15);
          history = [question, ...history];
          history = history.map(
            (item) => item.charAt(0).toUpperCase() + item.slice(1),
          );
          history = [...new Set(history)];
          localStorage.setItem("history", JSON.stringify(history));
          setRecentHistory(history);
        } else {
          localStorage.setItem("history", JSON.stringify([question]));
          setRecentHistory([question]);
        }
      }

      const payloadData = question ? question : selectedHistory;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: payloadData,
              },
            ],
          },
        ],
      };

      setLoader(true);
      let response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      response = await response.json();

      if (!response.candidates || response.candidates.length === 0) {
        console.log("No response for gemini..");
        return;
      }
      let dataString = response.candidates[0].content.parts[0].text;
      dataString = dataString.split("* ");
      dataString = dataString.map((item) => item.trim());
      // console.log(dataString)
      setResult((prev) => [
  ...prev,
  { type: "q", text: question || selectedHistory },
  { type: "a", text: dataString },
]);
      setQuestion("");

      setLoader(false);
    } catch (error) {
  console.log(error);
  setLoader(false);
}
  };

  const isEnter = (event) => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) {
      askQuestion();
    }
  }, [selectedHistory]);

  useEffect(() => {
  if (scrollToAns.current) {
    scrollToAns.current.scrollTop =
      scrollToAns.current.scrollHeight;
  }
}, [result]);

  //Dark Mode
  const [darkMode, setDarkMode] = useState("dark");
  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode === "dark" ? "dark" : "light"}>
      <div className="grid grid-cols-1 md:grid-cols-5 text-center min-h-dvh">
        <select
  value={darkMode}
  onChange={(e) => setDarkMode(e.target.value)}
  className="
fixed
top-4
left-4
z-50
text-sm
p-2
md:top-auto
md:bottom-8
md:left-5
"
>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
        />
        <div className="md:col-span-4 flex flex-col p-4 md:p-6 h-dvh">
          <h1
            className="
text-xl
sm:text-2xl
md:text-4xl
font-semibold
text-center
mb-6
bg-clip-text
text-transparent
bg-gradient-to-r
from-purple-400
to-pink-600
"
          >
            Hello User, Ask me Anything
          </h1>
          {loader && (
  <div
    className="flex justify-center items-center py-4"
    role="status"
  >
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-neutral-tertiary animate-spin fill-purple-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>

          )}
          <div ref={scrollToAns} className="flex-1 overflow-y-auto pb-24 md:pb-4">
            <div
              className="
dark:text-zinc-400
text-zinc-600
text-sm
md:text-lg
text-left
px-4
md:px-6
space-y-2
"
            >
              <ul>
                {result.map((item, index) => (
                  <QuestionAnswer key={index} item={item} index={index} />
                ))}
              </ul>
            </div>
          </div>
          <div
            className="
fixed
bottom-0
left-0
right-0
md-static
dark:bg-zinc-700
bg-gray-300
w-full
max-w-3xl
mx-auto
p-2
pr-4
rounded-t-2xl
md:rounded-full
border
dark:border-white
border-black
flex
items-center
z-50
"
          >
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(event) => setQuestion(event.target.value)}
              className="
flex-1
bg-transparent
outline-none
px-4
py-2
text-sm
md:text-base
"
              placeholder="Ask me Anything ?"
            />
            <button
              onClick={askQuestion}
              className="
px-4
py-2
font-semibold
text-sm
md:text-base
"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
